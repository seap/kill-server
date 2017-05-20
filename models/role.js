import _ from 'lodash'
import { nextSeq } from './counter'
import connect from './db'
import logger from '../common/logger'

// insert
export async function insert(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('role')
    const role = _.clone(doc)
    // insert new one
    role.updatedAt = role.createdAt = new Date()
    role.id = await nextSeq('role', db)  // generate increased id
    const result = await collection.insertOne(role)
    logger.log('debug', 'insert role result: %j', result)

    if (result.insertedCount === 1) {
      return role
    }
    throw new Error(`role_insert_error: ${result}`)
  } catch (e) {
    logger.log('error', 'insert role')
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
    const collection = db.collection('role')
    const role = _.clone(doc)
    // insert new one
    role.updatedAt = new Date()
    const result = await collection.updateOne(_.pick(role, ['id']), { $set: doc })
    logger.log('debug', 'update role result: %j', result)

    if (result.matchedCount === 1) {
      return role
    }
    throw new Error(`role_update_error: ${result}`)
  } catch (e) {
    logger.log('error', 'update role')
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
    const collection = db.collection('role')
    const result = await collection.deleteOne({ id })
    logger.log('debug', 'delete role: %j', result)
    if (result.deletedCount === 1) {
      return true
    }
    return false
  } catch (e) {
    logger.log('error', 'remove role, id: %s', id)
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// find role list
export async function findList(conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('role')
    const docs = await collection
      // .find({}, {_id: 0})
      .find({})
      .toArray()
    logger.log('debug', 'find role list: %j', docs)
    return docs
  } catch (e) {
    logger.log('error', 'find role list')
    throw e
  } finally {
    conn || (db && db.close())
  }
}