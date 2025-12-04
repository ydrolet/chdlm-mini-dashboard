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

export class MongodbService<T extends Document> {
  private collection!: Collection<T>

  private constructor(private config: MongodbServiceConfig<T>) {}

  static async create<T extends Document>(config: MongodbServiceConfig<T>) {
    const service = new MongodbService<T>(config)

    const client = new MongoClient(config.mongodbUri)
    await client.connect()
    const database = client.db(config.dbName)
    service.collection = database.collection<T>(config.collectionName)

    return service
  }

  private serializeDocument(document: OptionalUnlessRequiredId<T>) {
    return _.cloneDeepWith(document, (val) => {
      if (customDayjs.isDayjs(val)) {
        return val.toISOString()
      }
      else if (customDayjs.isDuration(val)) {
        return val.asSeconds()
      }
    })
  }

  async insertData(document: OptionalUnlessRequiredId<T>) {
    await this.collection.insertOne(this.serializeDocument(document))
  }

  async getLastDocument() {
    const document = await this.collection.findOne({}, {sort: {_id: -1}, projection: {_id: 0}})
    return this.config.validationSchema.parse(document)
  }
}
