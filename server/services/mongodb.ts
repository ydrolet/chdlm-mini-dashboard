import {
  type Document,
  type Collection,
  type OptionalUnlessRequiredId,
  MongoClient
} from "mongodb"

export class MongodbService<T extends Document> {
  private collection!: Collection<T>

  private constructor(
    private mongodbUri: string,
    private dbName: string,
    private collectionName: string,
  ) {
  }

  static async create<T extends Document>(
    mongodbUri: string,
    dbName: string,
    collectionName: string,
  ) {
    const service = new MongodbService<T>(
      mongodbUri,
      dbName,
      collectionName,
    )

    const client = new MongoClient(mongodbUri)
    await client.connect()
    const database = client.db(dbName)
    service.collection = database.collection<T>(collectionName)

    return service
  }

  async insertData(document: OptionalUnlessRequiredId<T>) {
    await this.collection.insertOne(document)
  }

  async getLastDocument() {
    return await this.collection.findOne({}, {sort: {_id: -1}, projection: {_id: 0}})
  }
}
