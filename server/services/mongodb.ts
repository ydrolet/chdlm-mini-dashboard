import {
  type Document,
  type Collection,
  type OptionalUnlessRequiredId,
  MongoClient
} from "mongodb"
import type {ZodType} from "zod"
import _ from "lodash"
import customDayjs from "#shared/utils/custom-dayjs"

type MongodbServiceConfig<T extends Document> = {
  mongodbUri: string
  dbName: string
  collectionName: string
  validationSchema: ZodType<T>
}

let mongoClient: Promise<MongoClient> | undefined

function getClient(mongodbUri: string) {
  if (!mongoClient) {
    mongoClient = new MongoClient(mongodbUri, {maxPoolSize: 10}).connect()
      .catch((error) => {
        mongoClient = undefined // Don't cache the failure, so the next request retries
        throw error
      })
  }
  return mongoClient
}

export class MongodbService<T extends Document> {
  private collection!: Collection<T>

  private constructor(private config: MongodbServiceConfig<T>) {}

  static async create<T extends Document>(config: MongodbServiceConfig<T>) {
    const service = new MongodbService<T>(config)

    const client = await getClient(config.mongodbUri)
    const database = client.db(config.dbName)
    service.collection = database.collection<T>(config.collectionName)

    return service
  }

  private serializeDocument(document: OptionalUnlessRequiredId<T>) {
    return _.cloneDeepWith(document, (val) => {
      if (customDayjs.isDayjs(val)) {
        return val.toDate()
      }
      else if (customDayjs.isDuration(val)) {
        return val.toISOString()
      }
    })
  }

  async insertData(document: OptionalUnlessRequiredId<T>) {
    await this.collection.insertOne(this.serializeDocument(document))
  }

  async getLastDocument(sortField: string) {
    const document = await this.collection.findOne({}, {sort: {[sortField]: -1}, projection: {_id: 0}})
    return this.config.validationSchema.parse(document)
  }
}
