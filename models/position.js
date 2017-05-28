import _ from 'lodash'
import { nextSeq } from './counter'
import connect from './db'
import logger from '../common/logger'

// insert
export async function insert(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('position')
    const position = _.clone(doc)
    // insert new one
    position.updatedAt = position.createdAt = new Date()
    position.id = await nextSeq('position', db)  // generate increased id
    const result = await collection.insertOne(position)
    logger.log('debug', 'insert position result: %j', result)

    if (result.insertedCount === 1) {
      return position
    }
    throw new Error(`position_insert_error: ${result}`)
  } catch (e) {
    logger.log('error', 'insert position')
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// update
export async function update(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('position')
    const position = _.clone(doc)
    // insert new one
    position.updatedAt = new Date()
    const result = await collection.updateOne(_.pick(position, ['id']), { $set: position })
    logger.log('debug', 'update position result: %j', result)

    if (result.matchedCount === 1) {
      return position
    }
    throw new Error(`position_update_error: ${result}`)
  } catch (e) {
    logger.log('error', 'update position')
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// delete
export async function remove(id, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('position')
    const result = await collection.deleteOne({ id })
    logger.log('debug', 'delete position: %j', result)
    if (result.deletedCount === 1) {
      return true
    }
    return false
  } catch (e) {
    logger.log('error', 'remove position, id: %s', id)
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// find position list
export async function findList(conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('position')
    const docs = await collection
      // .find({}, {_id: 0})
      .find({})
      .toArray()
    logger.log('debug', 'find position list: %j', docs)
    return docs
  } catch (e) {
    logger.log('error', 'find position list')
    throw e
  } finally {
    conn || (db && db.close())
  }
}