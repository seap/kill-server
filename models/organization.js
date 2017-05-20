import _ from 'lodash'
import { nextSeq } from './counter'
import connect from './db'
import logger from '../common/logger'

// insert
export async function insert(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('organization')
    const organization = _.clone(doc)
    // insert new one
    organization.updatedAt = organization.createdAt = new Date()
    organization.id = await nextSeq('organization', db)  // generate increased id
    const result = await collection.insertOne(organization)
    logger.log('debug', 'insert organization result: %j', result)

    if (result.insertedCount === 1) {
      return organization
    }
    throw new Error(`organization_insert_error: ${result}`)
  } catch (e) {
    logger.log('error', 'insert organization')
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
    const collection = db.collection('organization')
    const organization = _.clone(doc)
    // insert new one
    organization.updatedAt = new Date()
    const result = await collection.updateOne(_.pick(organization, ['id']), { $set: doc })
    logger.log('debug', 'update organization result: %j', result)

    if (result.matchedCount === 1) {
      return organization
    }
    throw new Error(`organization_update_error: ${result}`)
  } catch (e) {
    logger.log('error', 'update organization')
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
    const collection = db.collection('organization')
    const result = await collection.deleteOne({ id })
    logger.log('debug', 'delete organization: %j', result)
    if (result.deletedCount === 1) {
      return true
    }
    return false
  } catch (e) {
    logger.log('error', 'find organization, deptCode: %s', deptCode)
    throw e
  } finally {
    conn || (db && db.close())
  }
}


// find by deptCode
// export async function findByDeptCode(deptCode, conn) {
//   let db = null
//   try {
//     db = conn || await connect() // use outside connection
//     const collection = db.collection('organization')
//     const doc = await collection.findOne({ deptCode })
//     logger.log('debug', 'find organization: %j', doc)
//     return doc
//   } catch (e) {
//     logger.log('error', 'find organization, deptCode: %s', deptCode)
//     throw e
//   } finally {
//     conn || (db && db.close())
//   }
// }

// find organization list
export async function findList(conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('organization')
    const docs = await collection
      // .find({}, {_id: 0})
      .find({})
      .toArray()
    logger.log('debug', 'find organization list: %j', docs)
    return docs
  } catch (e) {
    logger.log('error', 'find organization list')
    throw e
  } finally {
    conn || (db && db.close())
  }
}