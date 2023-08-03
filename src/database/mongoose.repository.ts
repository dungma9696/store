import { PaginationParams, PaginationResult } from '../interfaces';
import mongoose, { FilterQuery, PipelineStage, SortOrder } from 'mongoose';

export class MongooseRepository<T extends mongoose.Document> {
  public TSchema: mongoose.Model<T>;

  constructor(_TSchema: mongoose.Model<T>) {
    this.TSchema = _TSchema;
  }

  async list(query: PaginationParams<T>): Promise<PaginationResult<T>> {
    const {
      limit = 10,
      page = 1,
      condition = {},
      sort = { updatedAt: -1 },
      projection = {},
      populate,
    } = query;
    const [data, count] = await Promise.all([
      this.TSchema.find(condition, projection)
        .populate(populate)
        .sort(sort)
        .limit(limit)
        .skip((page - 1) * limit || 0),
      this.TSchema.find(condition).countDocuments(),
    ]);
    return {
      count,
      currentPage: page,
      data,
      totalPage: Math.ceil(count / limit),
    };
  }

  async aggregateByConditions(params: {
    conditions: FilterQuery<T>;
    paginate: {
      page?: number;
      limit?: number;
      sort?:
        | string
        | { [key: string]: SortOrder | { $meta: 'textScore' } }
        | [string, SortOrder][];
    };
    overrideConditions?: FilterQuery<T>;
    projections?: { [key: string]: number };
    lookups?: PipelineStage.Lookup['$lookup'][];
    unwinds?: PipelineStage.Unwind['$unwind'][];
  }) {
    const page = +params.paginate.page || 1;
    const limit = +params.paginate.limit || 10;

    const lookups = params.lookups?.map((lookup) => ({
      $lookup: {
        ...lookup,
      },
    }));

    const unwinds = params.unwinds?.map((unwind) => ({
      $unwind:
        typeof unwind === 'string'
          ? unwind
          : {
              ...unwind,
            },
    }));

    const newConditions = [{ status: { $ne: 'deleted' } }];
    params.conditions.$and = (params.conditions || {}).$and
      ? params.conditions.$and.concat(newConditions)
      : newConditions;

    const paramConditions: any = [
      { $match: params.overrideConditions || params.conditions },
      { $facet: { data: [], totalItem: [{ $count: 'total' }] } },
      {
        $addFields: {
          totalItem: {
            $cond: {
              if: { $gte: [{ $size: '$totalItem' }, 1] },
              then: { $arrayElemAt: ['$totalItem.total', 0] },
              else: 0,
            },
          },
        },
      },
    ];

    if (unwinds) {
      unwinds.forEach((item) => {
        paramConditions.unshift(item);
      });
    }

    if (lookups) {
      lookups.forEach((item) => {
        paramConditions.unshift(item);
      });
    }

    const facet =
      paramConditions[paramConditions.findIndex((item) => item['$facet'])][
        '$facet'
      ];

    if (params.projections) {
      facet.data.push({ $project: params.projections });
    }

    facet.data.push({ $sort: params.paginate?.sort || '' });

    if (limit !== -1) {
      facet.data.push({ $skip: (page - 1) * limit }, { $limit: limit });
    }

    const docs = await this.TSchema.aggregate(paramConditions);
    return {
      data: docs[0].data,
      currentPage: page,
      count: docs[0].totalItem,
      totalPage: limit === -1 ? 1 : Math.ceil(docs[0].totalItem / limit),
    };
  }
}
