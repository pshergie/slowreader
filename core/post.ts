import {
  createFilter,
  createSyncMap,
  deleteSyncMapById,
  type Filter,
  type FilterStore,
  type SyncMapStore,
  syncMapTemplate
} from '@logux/client'
import { nanoid } from 'nanoid'

import { getClient } from './client.js'
import type { OptionalId } from './utils/stores.js'

export type OriginPost = {
  full?: string
  intro?: string
  media: string[]
  originId: string
  publishedAt?: number
  title?: string
  url?: string
}

export type PostValue = Omit<OriginPost, 'publishedAt'> & {
  feedId: string
  id: string
  publishedAt: number
  reading: 'fast' | 'slow'
}

export const Post = syncMapTemplate<PostValue>('posts', {
  offline: true,
  remote: false
})

export async function addPost(fields: OptionalId<PostValue>): Promise<string> {
  let id = fields.id ?? nanoid()
  await createSyncMap(getClient(), Post, { id, ...fields })
  return id
}

export function getPosts(
  filter: Filter<PostValue> = {}
): FilterStore<PostValue> {
  return createFilter(getClient(), Post, filter)
}

export function getPost(feedId: string): SyncMapStore<PostValue> {
  return Post(feedId, getClient())
}

export function deletePost(postId: string): Promise<void> {
  return deleteSyncMapById(getClient(), Post, postId)
}

let testPostId = 0

export function testPost(feed: Partial<PostValue> = {}): PostValue {
  testPostId += 1
  return {
    feedId: 'feed-1',
    id: `post-${testPostId}`,
    intro: `Post ${testPostId}`,
    media: [],
    originId: `test-${testPostId}`,
    publishedAt: 1000,
    reading: 'fast',
    url: `http://example.com/${testPostId}`,
    ...feed
  }
}
