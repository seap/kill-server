import { MongoClient } from 'mongodb'
import { mongoUrl, mongoOpt } from '../config'

// mongo connect
export default function connect() {
  return MongoClient.connect(mongoUrl, mongoOpt)
}