import _ from 'lodash'
import { ObjectId } from 'mongodb'
import { nextSeq } from './counter'
import connect from './db'
import logger from '../common/logger'

// insert
export async function insert(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('staff')
    const staff = _.clone(doc)
    // insert new one
    staff.updatedAt = staff.createdAt = new Date()
    staff.id = await nextSeq('staff', db)  // generate increased id
    const result = await collection.insertOne(staff)
    logger.log('debug', 'insert staff result: %j', result)

    if (result.insertedCount === 1) {
      return staff
    }
    throw new Error(`staff_insert_error: ${result}`)
  } catch (e) {
    logger.log('error', 'insert staff')
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
    const collection = db.collection('staff')
    const staff = _.clone(doc)
    // insert new one
    staff.updatedAt = new Date()
    // const result = await collection.updateOne({ _id: ObjectId(doc._id) }, { $set: doc })
    const result = await collection.updateOne({ id: doc.id }, { $set: doc })
    logger.log('debug', 'update staff result: %j', result)

    if (result.matchedCount === 1) {
      return staff
    }
    throw new Error(`staff_update_error: ${result}`)
  } catch (e) {
    logger.log('error', 'update staff')
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
    const collection = db.collection('staff')
    const result = await collection.deleteOne({ id })
    logger.log('debug', 'delete staff: %j', result)
    if (result.deletedCount === 1) {
      return true
    }
    return false
  } catch (e) {
    logger.log('error', 'remove staff, id: %s', id)
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// find staff list
export async function findList(conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('staff')
    const docs = await collection
      .find({}, { password: 0 })
      .toArray()
    logger.log('debug', 'find staff list: %j', docs)
    return docs
  } catch (e) {
    logger.log('error', 'find staff list')
    throw e
  } finally {
    conn || (db && db.close())
  }
}