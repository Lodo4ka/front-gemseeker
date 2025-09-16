import { infer as types } from 'zod';
import { contracts } from 'shared/api/contracts';
import { StoreWritable } from 'effector';

export type Post = types<typeof contracts.post.default>;

export type PostObject = Record<number, Post>;

export type PostsIds = number[] | null;

export type PostsIdsStore = StoreWritable<PostsIds>;
