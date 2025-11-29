import {type Collection, type Db, MongoClient} from "mongodb"

export class MongodbService {
  private client!: MongoClient
  private database!: Db
  private collection!: Collection

  private constructor(
    private mongodbUri: string,
    private dbName: string,
    private collectionName: string,
  ) {
  }

  static async create(
    mongodbUri: string,
    dbName: string,
    collectionName: string,
  ): Promise<MongodbService> {
    const service = new MongodbService(
      mongodbUri,
      dbName,
      collectionName,
    )

    service.client = new MongoClient(mongodbUri)
    await service.client.connect()
    service.database = service.client.db(dbName)
    service.collection = service.database.collection(collectionName)

    return service
  }

  async insertData(document: object) {
    await this.collection.insertOne(document)
  }

  async getLastDocument() {
    return await this.collection.findOne({}, {sort: {_id: -1}})
  }
}
