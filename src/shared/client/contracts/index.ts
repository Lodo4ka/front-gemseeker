import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";



type ReplyTreeNodeResponse = {
    id: number;
    user_id: number;
    user: UserResponseShort;
    text: string;
    attachments?: Array<string> | undefined;
    timestamp: number;
    likes: number;
    liked: boolean;
    replies: number;
    title: string;
    repost_of: (number | null) | Array<number | null>;
    views?: number | undefined;
    reposts?: number | undefined;
    children?: Array<ReplyTreeNodeResponse> | undefined;
};;
type UserResponseShort = {
    user_id: (number | null) | Array<number | null>;
    user_nickname: string;
    user_photo_hash: (string | null) | Array<string | null>;
};;
type ReplyTreeNodeThreadsResponse = {
    id: number;
    user_id: number;
    user: UserResponseShort;
    text: string;
    timestamp: number;
    likes: number;
    liked: boolean;
    token_id: number;
    replies: number;
    image?: ((string | null) | Array<string | null>) | undefined;
    repost_of?: ((number | null) | Array<number | null>) | undefined;
    children?: Array<ReplyTreeNodeThreadsResponse> | undefined;
};;

const LoginRequest = z.object({ wallet: z.string(), ref_id: z.number().int() }).passthrough();
const LoginResponse = z.object({ user_id: z.number().int(), nickname: z.string(), photo_hash: z.union([z.string(), z.null()]) }).passthrough();
const ValidationError = z.object({ loc: z.array(z.union([z.string(), z.number()])), msg: z.string(), type: z.string() }).passthrough();
const HTTPValidationError = z.object({ detail: z.array(ValidationError) }).partial().passthrough();
const NonceResponse = z.object({ nonce: z.string() }).passthrough();
const AuthRequest = z.object({ public_key: z.string(), signature: z.string(), signed_message: z.string(), ref_id: z.union([z.number(), z.null()]).optional() }).passthrough();
const UserInfoStreamObject = z.object({ slug: z.union([z.string(), z.null()]), type: z.union([z.enum(["token_stream", "no_token_stream"]), z.null()]) }).partial().passthrough();
const UserResponse = z.object({ user_id: z.number().int(), nickname: z.string(), photo_hash: z.union([z.string(), z.null()]), wallet_address: z.string(), is_moderator: z.boolean(), ref_balance: z.number(), ref_claimed: z.number(), user_invited: z.number().int(), spl_tokens: z.number().int(), transactions_amount: z.number(), stream: z.union([UserInfoStreamObject, z.null()]).optional() }).passthrough();
const UserTransactionResponse = z.object({ transaction_id: z.number().int(), hash: z.string(), token_name: z.string(), token_symbol: z.string(), token_photo_hash: z.string(), type: z.enum(["BUY", "SELL", "DEPLOY"]), sol_amount: z.number(), token_amount: z.number(), timestamp: z.number().int() }).passthrough();
const UserSPLTokenResponse = z.object({ id: z.number().int(), address: z.string(), trade_started: z.boolean(), status: z.enum(["ACTIVE", "FINISHED", "DEPLOYING", "FAILED"]), name: z.string(), symbol: z.string(), description: z.string(), photo_hash: z.string(), holders: z.number().int(), mcap: z.number(), mcap_diff: z.number(), created_at: z.number().int(), hidden: z.boolean(), rate: z.number(), bounding_curve: z.number() }).passthrough();
const from_id = z.union([z.number(), z.null()]).optional();
const UserProfileResponse = z.object({ user_id: z.number().int(), user_nickname: z.string(), user_photo_hash: z.union([z.string(), z.null()]), bio: z.string(), volume: z.number(), likes_received: z.number().int(), mentions_received: z.number().int(), tokens_created: z.number().int(), followers: z.number().int(), followees: z.number().int(), subscribed: z.boolean().optional().default(false) }).passthrough();
const Body_update_profile_api_user_update_profile_post = z.object({ photo: z.union([z.instanceof(File), z.null()]) }).partial().passthrough();
const bio = z.union([z.string(), z.null()]).optional();
const VolumeDailyResponse = z.object({ volume: z.number(), timestamp: z.number().int() }).passthrough();
const ReferralResponse = z.object({ total_referrals: z.number().int(), referrals_volume: z.number(), unclaimed_rewards: z.number(), claimed_rewards: z.number() }).passthrough();
const ReferralRewardResponse = z.object({ timestamp: z.number().int(), amount: z.number(), tx_id: z.string() }).passthrough();
const Body_add_spl_token_handler_api_token_create_post = z.object({ name: z.string(), symbol: z.string(), description: z.string(), is_nsfw: z.boolean().optional().default(false), twitter: z.union([z.string(), z.null()]).optional(), telegram: z.union([z.string(), z.null()]).optional(), youtube: z.union([z.string(), z.null()]).optional(), website: z.union([z.string(), z.null()]).optional(), buy: z.union([z.number(), z.null()]).optional(), photo: z.instanceof(File) }).passthrough();
const SPLTokenLinkResponse = z.object({ id: z.number().int(), json_link: z.string(), address: z.string() }).passthrough();
const SPLTokenUserResponse = z.object({ user_id: z.union([z.number(), z.null()]), user_nickname: z.string(), user_photo_hash: z.union([z.string(), z.null()]), subscribed: z.union([z.boolean(), z.null()]), subscribers: z.number().int() }).passthrough();
const SPLTokenFullResponse = z.object({ id: z.number().int(), created_by: SPLTokenUserResponse, deployer_wallet: z.union([z.string(), z.null()]), name: z.string(), symbol: z.string(), description: z.string(), photo_hash: z.string(), twitter: z.union([z.string(), z.null()]).optional(), telegram: z.union([z.string(), z.null()]).optional(), youtube: z.union([z.string(), z.null()]).optional(), website: z.union([z.string(), z.null()]).optional(), address: z.string(), trade_started: z.boolean(), trade_finished: z.boolean(), migrated: z.boolean(), last_tx_timestamp: z.number().int(), holders: z.number().int(), messages: z.number().int(), alltime_buy_txes: z.number().int(), alltime_sell_txes: z.number().int(), volume_24h: z.number(), mcap: z.number(), rate: z.number(), creation_date: z.number().int(), is_nsfw: z.boolean(), mcap_diff_24h: z.number(), is_streaming: z.boolean(), bounding_curve: z.number(), virtual_tokens: z.number().int(), virtual_sol: z.number().int(), real_tokens: z.number().int(), real_sol: z.number().int(), ath: z.number(), prev_ath: z.number(), is_favourite: z.union([z.boolean(), z.null()]), is_creator: z.boolean(), mcap_diff_5m: z.number(), mcap_diff_1h: z.number(), mcap_diff_6h: z.number(), alltime_volume: z.number(), alltime_buy_volume: z.number(), alltime_sell_volume: z.number(), alltime_makers: z.number().int(), slug: z.union([z.string(), z.null()]), alltime_buyers: z.number().int(), alltime_sellers: z.number().int(), pool: z.union([z.string(), z.null()]) }).passthrough();
const TimeWindowStats = z.object({ txns: z.number().int(), makers: z.number().int(), volume: z.number(), buys: z.number().int(), sells: z.number().int(), buy_volume: z.number(), sell_volume: z.number(), buyers: z.number().int(), sellers: z.number().int() }).passthrough();
const SPLTokenStatsResponse = z.object({ last_5m: TimeWindowStats, last_1h: TimeWindowStats, last_6h: TimeWindowStats, last_24h: TimeWindowStats }).passthrough();
const limit = z.union([z.number(), z.null()]).optional().default(10);
const page = z.union([z.number(), z.null()]).optional().default(1);
const UserResponseShort = z.object({ user_id: z.union([z.number(), z.null()]), user_nickname: z.string(), user_photo_hash: z.union([z.string(), z.null()]) }).passthrough();
const HolderResponse = z.object({ address: z.string(), user: UserResponseShort, amount: z.number(), percentage: z.number() }).passthrough();
const HolderStatusResponse = z.object({ user: UserResponseShort, pct: z.number(), balance: z.number(), category: z.enum(["fish", "whale"]) }).passthrough();
const SPLTokenResponse = z.object({ id: z.number().int(), created_by: UserResponseShort, deployer_wallet: z.union([z.string(), z.null()]), name: z.string(), symbol: z.string(), description: z.string(), photo_hash: z.string(), twitter: z.union([z.string(), z.null()]).optional(), telegram: z.union([z.string(), z.null()]).optional(), youtube: z.union([z.string(), z.null()]).optional(), website: z.union([z.string(), z.null()]).optional(), address: z.string(), trade_started: z.boolean(), trade_finished: z.boolean(), migrated: z.boolean(), last_tx_timestamp: z.number().int(), holders: z.number().int(), messages: z.number().int(), alltime_buy_txes: z.number().int(), alltime_sell_txes: z.number().int(), volume_24h: z.number(), mcap: z.number(), rate: z.number(), creation_date: z.number().int(), is_nsfw: z.boolean(), mcap_diff_24h: z.number(), is_streaming: z.boolean(), bounding_curve: z.number(), virtual_tokens: z.number().int(), virtual_sol: z.number().int(), real_tokens: z.number().int(), real_sol: z.number().int(), ath: z.number(), prev_ath: z.number() }).passthrough();
const SPLTokenWithStreamResponse = z.object({ id: z.number().int(), created_by: UserResponseShort, deployer_wallet: z.union([z.string(), z.null()]), name: z.string(), symbol: z.string(), description: z.string(), photo_hash: z.string(), twitter: z.union([z.string(), z.null()]).optional(), telegram: z.union([z.string(), z.null()]).optional(), youtube: z.union([z.string(), z.null()]).optional(), website: z.union([z.string(), z.null()]).optional(), address: z.string(), trade_started: z.boolean(), trade_finished: z.boolean(), migrated: z.boolean(), last_tx_timestamp: z.number().int(), holders: z.number().int(), messages: z.number().int(), alltime_buy_txes: z.number().int(), alltime_sell_txes: z.number().int(), volume_24h: z.number(), mcap: z.number(), rate: z.number(), creation_date: z.number().int(), is_nsfw: z.boolean(), mcap_diff_24h: z.number(), is_streaming: z.boolean(), bounding_curve: z.number(), virtual_tokens: z.number().int(), virtual_sol: z.number().int(), real_tokens: z.number().int(), real_sol: z.number().int(), ath: z.number(), prev_ath: z.number(), stream_slug: z.string(), stream_name: z.string(), stream_created_at: z.number() }).passthrough();
const SwapSPLExactToSmthRequest = z.object({ mint: z.string(), exact_amount_in: z.number(), min_amount_out: z.number(), speed: z.enum(["default", "auto"]), priority_fee: z.union([z.number(), z.null()]), bribery_amount: z.union([z.number(), z.null()]) }).passthrough();
const SwapSPLSmthToExactRequest = z.object({ mint: z.string(), max_amount_in: z.number(), exact_amount_out: z.number(), speed: z.enum(["default", "auto"]), priority_fee: z.union([z.number(), z.null()]), bribery_amount: z.union([z.number(), z.null()]) }).passthrough();
const FavouriteSPLTokenResponse = z.object({ id: z.number().int(), address: z.string(), symbol: z.string(), rate: z.number(), mcap: z.number(), mcap_diff_24h: z.number() }).passthrough();
const LimitOrderCreate = z.object({ type: z.string().optional(), mcap_target: z.number(), amount: z.number(), token_address: z.string(), expiry: z.union([z.number(), z.null()]).optional(), slippage: z.union([z.number(), z.null()]).optional() }).passthrough();
const LimitOrderOut = z.object({ id: z.number().int(), order_type: z.enum(["BUY_DIP", "STOP_LOSS", "TAKE_PROFIT"]), order_pubkey: z.string(), input_mint: z.string(), output_mint: z.string(), making_amount: z.number().int(), taking_amount: z.number().int(), start_mcap: z.number(), target_mcap: z.number(), status: z.enum(["ACTIVE", "CANCELLED", "FAILED", "SUCCESS"]), created_at: z.number().int(), expiry: z.union([z.number(), z.null()]), slippage: z.number(), triggered_at: z.union([z.number(), z.null()]) }).passthrough();
const SignatureResponse = z.object({ signature: z.string() }).passthrough();
const status = z.union([z.array(z.enum(["ACTIVE", "SUCCESS", "FAILED", "CANCELLED"])), z.null()]).optional();
const order_type = z.union([z.array(z.enum(["BUY_DIP", "STOP_LOSS", "TAKE_PROFIT"])), z.null()]).optional();
const token_mint = z.union([z.array(z.string()), z.null()]).optional();
const CustodialWalletResponse = z.object({ id: z.number().int(), name: z.string(), public_key: z.string(), holdings: z.number().int(), is_active: z.boolean(), is_archived: z.boolean() }).passthrough();
const CreateWalletRequest = z.object({ name: z.string() }).passthrough();
const NewCustodialWalletResponse = z.object({ id: z.number().int(), public_key: z.string(), private_key: z.string() }).passthrough();
const DepositItem = z.object({ wallet_id: z.number().int(), amount: z.number().gt(0), spl_token_address: z.string() }).passthrough();
const DepositBatchRequest = z.object({ items: z.array(DepositItem) }).passthrough();
const AccountMeta = z.object({ pubkey: z.string(), isSigner: z.boolean(), isWritable: z.boolean() }).passthrough();
const Instruction = z.object({ programId: z.string(), accounts: z.array(AccountMeta), data: z.string() }).passthrough();
const PreBuildTxBatchResponse = z.object({ instructions_batches: z.array(z.array(Instruction)) }).passthrough();
const CustodialWalletTxResponse = z.object({ signature: z.string(), wallet_address: z.string(), amount: z.number(), timestamp: z.number().int(), type: z.enum(["DEPOSIT", "WITHDRAW"]), mint: z.string() }).passthrough();
const SubscriptionResponse = z.object({ user_id: z.number().int(), user_nickname: z.string(), user_photo_hash: z.union([z.string(), z.null()]), user_subscribers: z.number().int() }).passthrough();
const UserWithSubscriptionsResponse = z.object({ user_id: z.number().int(), user_nickname: z.string(), user_photo_hash: z.union([z.string(), z.null()]), user_followers: z.number().int() }).passthrough();
const SubscribersListResponse = z.object({ subscribers: z.array(UserWithSubscriptionsResponse) }).passthrough();
const FolloweesListResponse = z.object({ followees: z.array(UserWithSubscriptionsResponse) }).passthrough();
const Body_create_api_posts_create_post = z.object({ files: z.union([z.array(z.instanceof(File)), z.null()]) }).partial().passthrough();
const title = z.union([z.string(), z.null()]).optional().default("");
const PostResponse = z.object({ id: z.number().int(), user_id: z.number().int(), user: UserResponseShort, text: z.string(), attachments: z.array(z.string()).optional(), timestamp: z.number().int(), likes: z.number().int(), liked: z.boolean(), replies: z.number().int(), title: z.string(), repost_of: z.union([z.number(), z.null()]), views: z.number().int().optional().default(0), reposts: z.number().int().optional().default(0) }).passthrough();
const Body_edit_post_api_posts_edit_patch = z.object({ delete_images: z.union([z.array(z.string()), z.null()]), additional_images: z.union([z.array(z.instanceof(File)), z.null()]) }).partial().passthrough();
const Body_reply_api_posts_reply_post = z.object({ files: z.union([z.array(z.instanceof(File)), z.null()]) }).partial().passthrough();
const ReplyTreeNodeResponse: z.ZodType<ReplyTreeNodeResponse> = z.lazy(() => z.object({ id: z.number().int(), user_id: z.number().int(), user: UserResponseShort, text: z.string(), attachments: z.array(z.string()).optional(), timestamp: z.number().int(), likes: z.number().int(), liked: z.boolean(), replies: z.number().int(), title: z.string(), repost_of: z.union([z.number(), z.null()]), views: z.number().int().optional().default(0), reposts: z.number().int().optional().default(0), children: z.array(ReplyTreeNodeResponse).optional() }).passthrough());
const PostListResponse = z.object({ posts: z.array(PostResponse) }).passthrough();
const PostLikesResponse = z.object({ post_id: z.number().int(), count: z.number().int(), users: z.array(z.number().int()) }).passthrough();
const PostViewsPair = z.object({ post_id: z.number().int(), count: z.number().int() }).passthrough();
const PostViewsResponse = z.object({ post_id: z.number().int(), count: z.number().int(), users: z.array(z.number().int()) }).passthrough();
const Body_repost_api_posts_repost_post = z.object({ files: z.union([z.array(z.instanceof(File)), z.null()]) }).partial().passthrough();
const SingleTransactionHistoryResponse = z.object({ price: z.number(), price_sol: z.number(), amount: z.number(), total: z.number(), total_sol: z.number(), maker: z.string(), token_photo_hash: z.string(), token_name: z.string(), timestamp: z.number().int(), type: z.string(), rate: z.number().optional().default(-1), sol_rate: z.number().optional().default(-1), address: z.union([z.string(), z.null()]).optional() }).passthrough();
const TradeHistoryResponse = z.object({ transactions: z.array(SingleTransactionHistoryResponse), wallet_id: z.union([z.number(), z.null()]).optional() }).passthrough();
const PlotCustomValues = z.object({ sol_value: z.number(), percentage: z.number() }).passthrough();
const PnlStatisticsForDayResponse = z.object({ time: z.number().int(), value: z.number(), customValues: PlotCustomValues.optional() }).passthrough();
const PnlStatisticsResponse = z.object({ realised_pnl: z.number().default(0), realised_pnl_sol: z.number().default(0), unrealised_pnl: z.number().default(0), unrealised_pnl_sol: z.number().default(0), pnl: z.number().default(0), pnl_sol: z.number().default(0), revenue: z.number().default(0), revenue_sol: z.number().default(0), spent: z.number().default(0), spent_sol: z.number().default(0), invested: z.number().default(0), invested_sol: z.number().default(0), sold: z.number().default(0), sold_sol: z.number().default(0), pnl_percentage: z.number().default(0) }).partial().passthrough();
const PnlStatisticsDailyResponse = z.object({ pnl_by_days: z.array(PnlStatisticsForDayResponse), whole_pnl: PnlStatisticsResponse }).passthrough();
const TokenStatisticsSingleResponse = z.object({ token_id: z.number().int(), address: z.union([z.string(), z.null()]).optional().default(""), pnl: z.number(), pnl_sol: z.number(), pnl_percentage: z.number(), photo_hash: z.string(), name: z.string() }).passthrough();
const MostProfitableResponse = z.object({ stat: z.array(TokenStatisticsSingleResponse), wallet_id: z.union([z.number(), z.null()]).optional() }).passthrough();
const ActivePositionsSingleResponse = z.object({ token_id: z.number().int(), amount: z.number(), amount_sol: z.number(), liquidity: z.number(), pnl: z.number(), pnl_sol: z.number(), name: z.string(), photo_hash: z.string(), address: z.union([z.string(), z.null()]).optional() }).passthrough();
const ActivePositionsResponse = z.object({ positions: z.array(ActivePositionsSingleResponse), wallet_id: z.union([z.number(), z.null()]).optional() }).passthrough();
const ThreadPostResponse = z.object({ id: z.number().int(), user_id: z.number().int(), user: UserResponseShort, text: z.string(), timestamp: z.number().int(), likes: z.number().int(), liked: z.boolean(), token_id: z.number().int(), replies: z.number().int(), image: z.union([z.string(), z.null()]).optional(), repost_of: z.union([z.number(), z.null()]).optional() }).passthrough();
const ThreadPostLikesResponse = z.object({ post_id: z.number().int(), token_id: z.number().int(), count: z.number().int(), users: z.array(z.number().int()) }).passthrough();
const ReplyTreeNodeThreadsResponse: z.ZodType<ReplyTreeNodeThreadsResponse> = z.lazy(() => z.object({ id: z.number().int(), user_id: z.number().int(), user: UserResponseShort, text: z.string(), timestamp: z.number().int(), likes: z.number().int(), liked: z.boolean(), token_id: z.number().int(), replies: z.number().int(), image: z.union([z.string(), z.null()]).optional(), repost_of: z.union([z.number(), z.null()]).optional(), children: z.array(ReplyTreeNodeThreadsResponse).optional() }).passthrough());
const TxResponse = z.object({ user_info: UserResponseShort, id: z.number().int(), hash: z.string(), token_amount: z.number(), sol_amount: z.number(), type: z.string(), rate: z.number(), timestamp: z.number().int(), pnl: z.union([z.number(), z.null()]).optional(), maker: z.union([z.string(), z.null()]) }).passthrough();
const ChartBar = z.object({ timestamp: z.number().int(), rate: z.number(), type: z.string() }).passthrough();
const RecentTxResponse = z.object({ user_info: UserResponseShort, hash: z.union([z.string(), z.null()]), token_amount: z.number(), sol_amount: z.number(), type: z.enum(["BUY", "SELL", "MIGRATION", "DEPLOY", "STREAM_CREATED", "STREAM_FINISHED", "DONATION_RECEIVED"]), rate: z.union([z.number(), z.null()]), timestamp: z.number().int(), token_address: z.union([z.string(), z.null()]), token_name: z.union([z.string(), z.null()]), token_symbol: z.union([z.string(), z.null()]), token_photo_hash: z.union([z.string(), z.null()]), slug: z.union([z.string(), z.null()]), donation_text: z.union([z.string(), z.null()]) }).passthrough();
const StreamTask = z.object({ description: z.string(), donation_target: z.union([z.number(), z.null()]).optional(), mcap_target: z.union([z.number(), z.null()]).optional(), token_address: z.union([z.string(), z.null()]).optional() }).passthrough();
const CreateRoomRequest = z.object({ name: z.string(), tasks: z.array(StreamTask), show_stream_on: z.array(z.string()), is_nsfw: z.boolean() }).passthrough();
const CreateRoomResponse = z.object({ slug: z.string() }).passthrough();
const UserStreamResponse = z.object({ user_id: z.union([z.number(), z.null()]), user_nickname: z.string(), user_photo_hash: z.union([z.string(), z.null()]), subscribers: z.number().int(), subscribed: z.union([z.boolean(), z.null()]) }).passthrough();
const RoomResponseWSum = z.object({ slug: z.string(), name: z.string(), creator: UserStreamResponse, created_at: z.number(), viewers: z.number().int(), is_nsfw: z.boolean(), stream_tokens: z.array(SPLTokenResponse), donation_sum: z.number(), finished: z.boolean() }).passthrough();
const RoomListResponse = z.object({ slug: z.string(), name: z.string(), creator: UserResponseShort, created_at: z.number(), viewers: z.number().int(), is_nsfw: z.boolean(), stream_tokens: z.array(SPLTokenResponse), donation_sum: z.number(), tasks: z.array(StreamTask) }).passthrough();
const GetWsUrlResponse = z.object({ ws_url: z.string(), client_ip: z.string() }).passthrough();
const JoinRoomRequest = z.object({ slug: z.string(), ws_url: z.string() }).passthrough();
const JoinRoomResponse = z.object({ url: z.string(), access_token: z.string(), slug: z.string(), room_name: z.string(), is_creator: z.boolean() }).passthrough();
const DonateStreamRequest = z.object({ slug: z.string(), amount: z.number(), text: z.string() }).passthrough();
const DonateStreamResponse = z.object({ amount: z.number(), text: z.string(), user: UserResponseShort, timestamp: z.number().int(), wallet_address: z.string(), signature: z.string() }).passthrough();
const ListChatMessageResponse = z.object({ id: z.union([z.string(), z.number()]), user_info: UserResponseShort, text: z.string(), timestamp: z.number().int(), type: z.enum(["message", "donation"]), amount: z.union([z.number(), z.null()]) }).passthrough();
const LeaderboardResponse = z.object({ place: z.number().int(), user: UserResponseShort, volume: z.number(), pnl: z.number() }).passthrough();
const rpc_endpoint_api_rpc_post_Body = z.union([z.object({}).partial().passthrough(), z.array(z.object({}).partial().passthrough())]);

export const schemas = {
	LoginRequest,
	LoginResponse,
	ValidationError,
	HTTPValidationError,
	NonceResponse,
	AuthRequest,
	UserInfoStreamObject,
	UserResponse,
	UserTransactionResponse,
	UserSPLTokenResponse,
	from_id,
	UserProfileResponse,
	Body_update_profile_api_user_update_profile_post,
	bio,
	VolumeDailyResponse,
	ReferralResponse,
	ReferralRewardResponse,
	Body_add_spl_token_handler_api_token_create_post,
	SPLTokenLinkResponse,
	SPLTokenUserResponse,
	SPLTokenFullResponse,
	TimeWindowStats,
	SPLTokenStatsResponse,
	limit,
	page,
	UserResponseShort,
	HolderResponse,
	HolderStatusResponse,
	SPLTokenResponse,
	SPLTokenWithStreamResponse,
	SwapSPLExactToSmthRequest,
	SwapSPLSmthToExactRequest,
	FavouriteSPLTokenResponse,
	LimitOrderCreate,
	LimitOrderOut,
	SignatureResponse,
	status,
	order_type,
	token_mint,
	CustodialWalletResponse,
	CreateWalletRequest,
	NewCustodialWalletResponse,
	DepositItem,
	DepositBatchRequest,
	AccountMeta,
	Instruction,
	PreBuildTxBatchResponse,
	CustodialWalletTxResponse,
	SubscriptionResponse,
	UserWithSubscriptionsResponse,
	SubscribersListResponse,
	FolloweesListResponse,
	Body_create_api_posts_create_post,
	title,
	PostResponse,
	Body_edit_post_api_posts_edit_patch,
	Body_reply_api_posts_reply_post,
	ReplyTreeNodeResponse,
	PostListResponse,
	PostLikesResponse,
	PostViewsPair,
	PostViewsResponse,
	Body_repost_api_posts_repost_post,
	SingleTransactionHistoryResponse,
	TradeHistoryResponse,
	PlotCustomValues,
	PnlStatisticsForDayResponse,
	PnlStatisticsResponse,
	PnlStatisticsDailyResponse,
	TokenStatisticsSingleResponse,
	MostProfitableResponse,
	ActivePositionsSingleResponse,
	ActivePositionsResponse,
	ThreadPostResponse,
	ThreadPostLikesResponse,
	ReplyTreeNodeThreadsResponse,
	TxResponse,
	ChartBar,
	RecentTxResponse,
	StreamTask,
	CreateRoomRequest,
	CreateRoomResponse,
	UserStreamResponse,
	RoomResponseWSum,
	RoomListResponse,
	GetWsUrlResponse,
	JoinRoomRequest,
	JoinRoomResponse,
	DonateStreamRequest,
	DonateStreamResponse,
	ListChatMessageResponse,
	LeaderboardResponse,
	rpc_endpoint_api_rpc_post_Body,
};

const endpoints = makeApi([
	{
		method: "get",
		path: "/",
		alias: "health__get",
		requestFormat: "json",
		response: z.unknown(),
	},
	{
		method: "get",
		path: "/api/chat/:stream_slug",
		alias: "get_chat_messages_api_chat__stream_slug__get",
		requestFormat: "json",
		parameters: [
			{
				name: "stream_slug",
				type: "Path",
				schema: z.string().min(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(20)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
		],
		response: z.array(ListChatMessageResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/leaderboard/top100",
		alias: "get_leaderboard_top100_api_leaderboard_top100_get",
		description: `Get leaderboard`,
		requestFormat: "json",
		parameters: [
			{
				name: "sort_field",
				type: "Query",
				schema: z.enum(["volume", "pnl"]).optional().default("volume")
			},
		],
		response: z.array(LeaderboardResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/limit-orders",
		alias: "create_limit_order_api_limit_orders_post",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: LimitOrderCreate
			},
		],
		response: LimitOrderOut,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/limit-orders/:order_pubkey/cancel",
		alias: "cancel_limit_order_api_limit_orders__order_pubkey__cancel_post",
		requestFormat: "json",
		parameters: [
			{
				name: "order_pubkey",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.object({ signature: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/limit-orders/active",
		alias: "get_orders_api_limit_orders_active_get",
		requestFormat: "json",
		parameters: [
			{
				name: "wallet_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "status",
				type: "Query",
				schema: status
			},
			{
				name: "order_type",
				type: "Query",
				schema: order_type
			},
			{
				name: "token_mint",
				type: "Query",
				schema: token_mint
			},
		],
		response: z.array(LimitOrderOut),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/portfolio/active_positions",
		alias: "get_active_positions_api_portfolio_active_positions_get",
		description: `Get Active Positions`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
			{
				name: "address",
				type: "Query",
				schema: bio
			},
		],
		response: ActivePositionsResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/portfolio/most_profitable",
		alias: "get_most_profitable_api_portfolio_most_profitable_get",
		description: `Get Most Profitable tokens`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
			{
				name: "address",
				type: "Query",
				schema: bio
			},
		],
		response: MostProfitableResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/portfolio/pnl_statistics_all",
		alias: "get_pnl_statistics_all_api_portfolio_pnl_statistics_all_get",
		description: `Get PNL Statistics, average PNL, total PNL, total spent, total revenue, total invested, total sold all`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "address",
				type: "Query",
				schema: bio
			},
		],
		response: PnlStatisticsDailyResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/portfolio/pnl_statistics_by_period",
		alias: "get_pnl_statistics_by_period_api_portfolio_pnl_statistics_by_period_get",
		description: `Get PNL Statistics, average PNL, total PNL, total spent, total revenue, total invested, total sold by days provided`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "delta",
				type: "Query",
				schema: z.number().int().optional().default(1)
			},
			{
				name: "address",
				type: "Query",
				schema: bio
			},
		],
		response: PnlStatisticsDailyResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/portfolio/trade_history",
		alias: "get_trade_history_api_portfolio_trade_history_get",
		description: `Get Trade History`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
			{
				name: "address",
				type: "Query",
				schema: bio
			},
		],
		response: TradeHistoryResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/portfolio/txs_debug",
		alias: "get_wallets_debug_api_portfolio_txs_debug_get",
		requestFormat: "json",
		response: z.unknown(),
	},
	{
		method: "post",
		path: "/api/posts/create",
		alias: "create_api_posts_create_post",
		description: `Create a post`,
		requestFormat: "form-data",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Body_create_api_posts_create_post
			},
			{
				name: "title",
				type: "Query",
				schema: title
			},
			{
				name: "text",
				type: "Query",
				schema: title
			},
		],
		response: PostResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "delete",
		path: "/api/posts/delete",
		alias: "delete_api_posts_delete_delete",
		description: `Delete a post`,
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: z.void(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "patch",
		path: "/api/posts/edit",
		alias: "edit_post_api_posts_edit_patch",
		description: `Edit a post`,
		requestFormat: "form-data",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Body_edit_post_api_posts_edit_patch
			},
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "text",
				type: "Query",
				schema: bio
			},
			{
				name: "title",
				type: "Query",
				schema: bio
			},
		],
		response: PostResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/posts/get_post_by_id",
		alias: "post_by_id_api_posts_get_post_by_id_get",
		description: `Get post by id`,
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "from_id",
				type: "Query",
				schema: from_id
			},
		],
		response: PostResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/posts/get_posts_by_user",
		alias: "posts_by_user_api_posts_get_posts_by_user_get",
		description: `Get posts by user`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "from_id",
				type: "Query",
				schema: from_id
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
		],
		response: PostListResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/posts/global",
		alias: "global_posts_api_posts_global_get",
		description: `Get global feed`,
		requestFormat: "json",
		parameters: [
			{
				name: "from_id",
				type: "Query",
				schema: from_id
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
		],
		response: PostListResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/posts/like",
		alias: "like_api_posts_like_post",
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: PostLikesResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/posts/post_views",
		alias: "post_views_api_posts_post_views_get",
		description: `Get post views`,
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: PostViewsResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/posts/posts_by_user_subscriptions",
		alias: "posts_by_user_subscriptions_api_posts_posts_by_user_subscriptions_get",
		description: `Get posts by user subscriptions`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
		],
		response: PostListResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/posts/replies_tree",
		alias: "replies_tree_api_posts_replies_tree_get",
		description: `Replies tree`,
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "from_id",
				type: "Query",
				schema: from_id
			},
		],
		response: ReplyTreeNodeResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/posts/reply",
		alias: "reply_api_posts_reply_post",
		description: `Reply to post by parent_id`,
		requestFormat: "form-data",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Body_reply_api_posts_reply_post
			},
			{
				name: "parent_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "text",
				type: "Query",
				schema: z.string()
			},
		],
		response: PostResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/posts/repost",
		alias: "repost_api_posts_repost_post",
		description: `Repost post`,
		requestFormat: "form-data",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Body_repost_api_posts_repost_post
			},
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "title",
				type: "Query",
				schema: z.string()
			},
			{
				name: "text",
				type: "Query",
				schema: z.string()
			},
		],
		response: PostResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "delete",
		path: "/api/posts/unlike",
		alias: "unlike_api_posts_unlike_delete",
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: PostLikesResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/posts/update_views",
		alias: "update_views_api_posts_update_views_post",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.array(z.number().int())
			},
		],
		response: z.array(PostViewsPair),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/room/add_token_to_stream",
		alias: "add_token_to_stream_handler_api_room_add_token_to_stream_post",
		description: `Add token to stream`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_address",
				type: "Query",
				schema: z.string()
			},
			{
				name: "slug",
				type: "Query",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/room/create",
		alias: "create_room_handler_api_room_create_post",
		description: `Create room`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateRoomRequest
			},
		],
		response: z.object({ slug: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/room/delete",
		alias: "delete_room_handler_api_room_delete_post",
		description: `Delete room`,
		requestFormat: "json",
		response: z.unknown(),
	},
	{
		method: "post",
		path: "/api/room/donate",
		alias: "donate_to_stream_handler_api_room_donate_post",
		description: `Donate room`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: DonateStreamRequest
			},
		],
		response: DonateStreamResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/room/donations",
		alias: "get_donations_handler_api_room_donations_get",
		description: `Get donations`,
		requestFormat: "json",
		parameters: [
			{
				name: "slug",
				type: "Query",
				schema: z.string()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
		],
		response: z.array(DonateStreamResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/room/info/:slug",
		alias: "get_room_info_handler_api_room_info__slug__get",
		description: `Get room information`,
		requestFormat: "json",
		parameters: [
			{
				name: "slug",
				type: "Path",
				schema: z.string()
			},
		],
		response: RoomResponseWSum,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/room/join",
		alias: "join_room_handler_api_room_join_post",
		description: `Join room`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: JoinRoomRequest
			},
		],
		response: JoinRoomResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/room/list",
		alias: "get_rooms_list_handler_api_room_list_get",
		description: `Get room`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
			{
				name: "show_nsfw",
				type: "Query",
				schema: z.boolean().optional().default(false)
			},
			{
				name: "sorting_filter",
				type: "Query",
				schema: z.enum(["all_streams", "token_stream", "no_token_stream"]).optional().default("all_streams")
			},
		],
		response: z.array(RoomListResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/room/tasks",
		alias: "get_tasks_handler_api_room_tasks_get",
		description: `Get tasks`,
		requestFormat: "json",
		parameters: [
			{
				name: "slug",
				type: "Query",
				schema: z.string()
			},
		],
		response: z.array(StreamTask),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/room/ws_url",
		alias: "get_ws_url_handler_api_room_ws_url_get",
		description: `Get ws url`,
		requestFormat: "json",
		parameters: [
			{
				name: "slug",
				type: "Query",
				schema: z.string()
			},
		],
		response: GetWsUrlResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/rpc",
		alias: "rpc_endpoint_api_rpc_post",
		description: `RPC endpoint`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: rpc_endpoint_api_rpc_post_Body
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/subscriptions/followees_list",
		alias: "followees_list_api_subscriptions_followees_list_get",
		description: `Followees list by id`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
		],
		response: FolloweesListResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/subscriptions/subscribe",
		alias: "subscribe_api_subscriptions_subscribe_post",
		description: `subscribe authenticated_user -&gt; followee_id`,
		requestFormat: "json",
		parameters: [
			{
				name: "followee_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: SubscriptionResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/subscriptions/subscribers_list",
		alias: "subscribers_list_api_subscriptions_subscribers_list_get",
		description: `Subscribers list by id`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
		],
		response: SubscribersListResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "delete",
		path: "/api/subscriptions/unsubscribe",
		alias: "unsubscribe_api_subscriptions_unsubscribe_delete",
		description: `delete user&#x27;s subscription`,
		requestFormat: "json",
		parameters: [
			{
				name: "followee_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: SubscriptionResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/threads/create",
		alias: "create_api_threads_create_post",
		description: `Create a post`,
		requestFormat: "json",
		parameters: [
			{
				name: "text",
				type: "Query",
				schema: z.string()
			},
			{
				name: "token_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: ThreadPostResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/threads/get_post_by_id",
		alias: "post_by_id_api_threads_get_post_by_id_get",
		description: `Get post by id`,
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "from_id",
				type: "Query",
				schema: from_id
			},
		],
		response: ThreadPostResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/threads/like",
		alias: "like_api_threads_like_post",
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: ThreadPostLikesResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/threads/post_likes",
		alias: "post_likes_api_threads_post_likes_get",
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: ThreadPostLikesResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/threads/replies_tree",
		alias: "replies_tree_api_threads_replies_tree_get",
		description: `Replies tree`,
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "from_id",
				type: "Query",
				schema: from_id
			},
		],
		response: ReplyTreeNodeThreadsResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/threads/reply",
		alias: "reply_api_threads_reply_post",
		description: `Reply to post by parent_id`,
		requestFormat: "json",
		parameters: [
			{
				name: "parent_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "text",
				type: "Query",
				schema: z.string()
			},
		],
		response: ThreadPostResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/threads/repost",
		alias: "repost_api_threads_repost_post",
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "text",
				type: "Query",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/threads/token_thread",
		alias: "token_thread_api_threads_token_thread_get",
		requestFormat: "json",
		parameters: [
			{
				name: "token_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "from_id",
				type: "Query",
				schema: from_id
			},
			{
				name: "sorting_filter",
				type: "Query",
				schema: z.enum(["asc", "desc"]).optional().default("asc")
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
		],
		response: z.array(ThreadPostResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "delete",
		path: "/api/threads/unlike",
		alias: "unlike_api_threads_unlike_delete",
		requestFormat: "json",
		parameters: [
			{
				name: "post_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: ThreadPostLikesResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token",
		alias: "get_spl_token_handler_api_token_get",
		description: `Get spl_token by id`,
		requestFormat: "json",
		parameters: [
			{
				name: "address",
				type: "Query",
				schema: z.string()
			},
		],
		response: SPLTokenFullResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/audit/:token_address",
		alias: "proxy_to_goplus_api_token_audit__token_address__get",
		description: `Audit SPL token by address`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_address",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/token/create",
		alias: "add_spl_token_handler_api_token_create_post",
		description: `Add new spl_token`,
		requestFormat: "form-data",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Body_add_spl_token_handler_api_token_create_post
			},
		],
		response: SPLTokenLinkResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/favourite",
		alias: "get_favourite_tokens_api_token_favourite_get",
		description: `Get user&#x27;s favourite SPL tokens`,
		requestFormat: "json",
		response: z.array(FavouriteSPLTokenResponse),
	},
	{
		method: "post",
		path: "/api/token/favourite/:token_address",
		alias: "add_favourite_token_api_token_favourite__token_address__post",
		description: `Add SPL token to favourites`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_address",
				type: "Path",
				schema: z.string()
			},
		],
		response: FavouriteSPLTokenResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "delete",
		path: "/api/token/favourite/:token_address",
		alias: "remove_favourite_token_api_token_favourite__token_address__delete",
		description: `Remove SPL token from favourites`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_address",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/holders",
		alias: "get_holders_handler_api_token_holders_get",
		description: `Get spl_token holders`,
		requestFormat: "json",
		parameters: [
			{
				name: "spl_token_id_address",
				type: "Query",
				schema: z.string()
			},
			{
				name: "limit",
				type: "Query",
				schema: limit
			},
			{
				name: "page",
				type: "Query",
				schema: page
			},
		],
		response: z.array(HolderResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/holders/status",
		alias: "get_holders_status_handler_api_token_holders_status_get",
		description: `Get holders status for SPL token`,
		requestFormat: "json",
		parameters: [
			{
				name: "address",
				type: "Query",
				schema: z.string()
			},
		],
		response: z.array(HolderStatusResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/insiders/:token_address",
		alias: "get_insiders_api_token_insiders__token_address__get",
		description: `Get insiders for SPL token by address`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_address",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/list",
		alias: "get_spl_tokens_handler_api_token_list_get",
		description: `Get spl_tokens`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
			{
				name: "show_nsfw",
				type: "Query",
				schema: z.boolean().optional().default(false)
			},
			{
				name: "sorting_filter",
				type: "Query",
				schema: z.enum(["new", "last_order", "gain", "mcap", "raydium", "user", "live_stream"]).optional().default("new")
			},
			{
				name: "sorting_order",
				type: "Query",
				schema: z.enum(["desc", "asc"]).optional().default("desc")
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: z.array(SPLTokenResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/on_the_rocket",
		alias: "get_spl_token_on_the_rocket_handler_api_token_on_the_rocket_get",
		description: `Get spl_token on the rocket`,
		requestFormat: "json",
		parameters: [
			{
				name: "show_nsfw",
				type: "Query",
				schema: z.boolean().optional().default(false)
			},
		],
		response: SPLTokenResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/snipers/:token_address",
		alias: "get_snipers_api_token_snipers__token_address__get",
		description: `Get snipers for SPL token by address`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_address",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/stats",
		alias: "get_spl_token_stats_handler_api_token_stats_get",
		description: `Get spl_token stats`,
		requestFormat: "json",
		parameters: [
			{
				name: "spl_token_id_address",
				type: "Query",
				schema: z.string()
			},
		],
		response: SPLTokenStatsResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/token/swap_a_to_exact_b",
		alias: "swap_a_to_exact_b_handler_api_token_swap_a_to_exact_b_post",
		description: `Swap A to Exact B (Sell token A for exact SOL)`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: SwapSPLSmthToExactRequest
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/token/swap_b_to_exact_a",
		alias: "swap_b_to_exact_a_handler_api_token_swap_b_to_exact_a_post",
		description: `Swap B to Exact A (Buy token A with SOL, exact token out)`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: SwapSPLSmthToExactRequest
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/token/swap_exact_a_to_b",
		alias: "swap_exact_a_to_b_handler_api_token_swap_exact_a_to_b_post",
		description: `Swap Exact A to B (Sell token A for SOL)`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: SwapSPLExactToSmthRequest
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/token/swap_exact_b_to_a",
		alias: "swap_exact_b_to_a_handler_api_token_swap_exact_b_to_a_post",
		description: `Swap Exact B to A (Buy token A with fixed SOL)`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: SwapSPLExactToSmthRequest
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/token/with_streams",
		alias: "get_spl_tokens_with_streams_handler_api_token_with_streams_get",
		description: `Get spl_tokens with streams`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
			{
				name: "is_nsfw",
				type: "Query",
				schema: z.boolean().optional().default(false)
			},
		],
		response: z.array(SPLTokenWithStreamResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/tx",
		alias: "get_spl_token_tx_api_tx_get",
		description: `Get spl token transactions`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_id_address",
				type: "Query",
				schema: z.string()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
		],
		response: z.array(TxResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/tx/last-by-token",
		alias: "get_last_tx_by_token_handler_api_tx_last_by_token_get",
		description: `Get last transactions by token address or id`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_address",
				type: "Query",
				schema: z.string()
			},
		],
		response: RecentTxResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/tx/price-chart",
		alias: "get_price_chart_api_tx_price_chart_get",
		description: `Get price chart for a token`,
		requestFormat: "json",
		parameters: [
			{
				name: "token_address",
				type: "Query",
				schema: z.string()
			},
			{
				name: "currency",
				type: "Query",
				schema: z.enum(["USD", "SOL"])
			},
		],
		response: z.array(ChartBar),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/tx/recent",
		alias: "get_recent_tx_handler_api_tx_recent_get",
		description: `Get recent transactions`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(3)
			},
			{
				name: "show_events",
				type: "Query",
				schema: z.array(z.enum(["BUY", "SELL", "MIGRATION", "DEPLOY", "STREAM_CREATED", "STREAM_FINISHED", "DONATION_RECEIVED"])).optional()
			},
			{
				name: "show_nsfw",
				type: "Query",
				schema: z.boolean().optional().default(false)
			},
		],
		response: z.array(RecentTxResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/user/auth",
		alias: "authenticate_api_user_auth_post",
		description: `Authenticate with SIWS`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AuthRequest
			},
		],
		response: LoginResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/user/claim_ref_balance",
		alias: "claim_ref_balance_api_user_claim_ref_balance_post",
		description: `Claim ref balance`,
		requestFormat: "json",
		response: UserResponse,
	},
	{
		method: "post",
		path: "/api/user/logout",
		alias: "logout_api_user_logout_post",
		requestFormat: "json",
		response: z.unknown(),
	},
	{
		method: "get",
		path: "/api/user/me",
		alias: "get_user_info_api_user_me_get",
		description: `Get user info`,
		requestFormat: "json",
		response: UserResponse,
	},
	{
		method: "get",
		path: "/api/user/nonce",
		alias: "generate_nonce_api_user_nonce_get",
		description: `Get nonce for SIWS`,
		requestFormat: "json",
		response: z.object({ nonce: z.string() }).passthrough(),
	},
	{
		method: "get",
		path: "/api/user/profile",
		alias: "get_profile_api_user_profile_get",
		description: `Get user profile by id`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "from_id",
				type: "Query",
				schema: from_id
			},
		],
		response: UserProfileResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/user/ref_reward_history",
		alias: "get_user_referral_history_api_user_ref_reward_history_get",
		description: `Get user referral history`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(200).optional().default(50)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
		],
		response: z.array(ReferralRewardResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/user/referrals",
		alias: "get_user_referrals_api_user_referrals_get",
		description: `Get user referrals`,
		requestFormat: "json",
		response: ReferralResponse,
	},
	{
		method: "post",
		path: "/api/user/refresh",
		alias: "refresh_endpoint_api_user_refresh_post",
		requestFormat: "json",
		response: z.unknown(),
	},
	{
		method: "get",
		path: "/api/user/spl_tokens",
		alias: "get_user_spl_tokens_api_user_spl_tokens_get",
		description: `Get user spl_tokens`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(1000).optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
		],
		response: z.array(UserSPLTokenResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/user/testlogin",
		alias: "login_user_api_user_testlogin_post",
		description: `Login with SIWS`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: LoginRequest
			},
		],
		response: LoginResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/user/transactions",
		alias: "get_user_transactions_api_user_transactions_get",
		description: `Get user transactions`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
		],
		response: z.array(UserTransactionResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/user/update_profile",
		alias: "update_profile_api_user_update_profile_post",
		description: `Update user&#x27;s profile`,
		requestFormat: "form-data",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Body_update_profile_api_user_update_profile_post
			},
			{
				name: "bio",
				type: "Query",
				schema: bio
			},
			{
				name: "nickname",
				type: "Query",
				schema: bio
			},
		],
		response: UserProfileResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/user/user_activity",
		alias: "get_user_activity_api_user_user_activity_get",
		description: `Get user activity`,
		requestFormat: "json",
		parameters: [
			{
				name: "user_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional().default(0)
			},
		],
		response: z.array(VolumeDailyResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/wallets",
		alias: "get_user_wallets_api_wallets_get",
		description: `Get user wallets`,
		requestFormat: "json",
		parameters: [
			{
				name: "archived",
				type: "Query",
				schema: z.boolean().optional()
			},
		],
		response: z.array(CustodialWalletResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/wallets/add_deposit_transaction",
		alias: "add_deposit_transaction_api_wallets_add_deposit_transaction_post",
		description: `Add deposit transaction`,
		requestFormat: "json",
		parameters: [
			{
				name: "signature",
				type: "Query",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/wallets/archive",
		alias: "archive_user_wallet_api_wallets_archive_post",
		description: `Archieve wallet`,
		requestFormat: "json",
		parameters: [
			{
				name: "wallet_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/wallets/create",
		alias: "create_new_wallet_api_wallets_create_post",
		description: `Create wallet`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ name: z.string() }).passthrough()
			},
		],
		response: NewCustodialWalletResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/wallets/deposit",
		alias: "deposit_user_wallet_batch_api_wallets_deposit_post",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: DepositBatchRequest
			},
		],
		response: PreBuildTxBatchResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/wallets/rename",
		alias: "rename_user_wallet_api_wallets_rename_post",
		description: `Rename wallet`,
		requestFormat: "json",
		parameters: [
			{
				name: "wallet_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "new_name",
				type: "Query",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/wallets/set_active",
		alias: "set_active_user_wallet_api_wallets_set_active_post",
		description: `Set wallet active`,
		requestFormat: "json",
		parameters: [
			{
				name: "wallet_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/api/wallets/tx_history",
		alias: "get_wallet_tx_history_api_wallets_tx_history_get",
		description: `Get wallet tx history`,
		requestFormat: "json",
		parameters: [
			{
				name: "sorting_filter",
				type: "Query",
				schema: z.enum(["withdraw", "deposit", "all"]).optional().default("all")
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(0).lte(100).optional().default(10)
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().gte(0).optional().default(0)
			},
		],
		response: z.array(CustodialWalletTxResponse),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/wallets/unarchive",
		alias: "unarchive_user_wallet_api_wallets_unarchive_post",
		description: `Unarchieve wallet`,
		requestFormat: "json",
		parameters: [
			{
				name: "wallet_id",
				type: "Query",
				schema: z.number().int()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/api/wallets/withdraw",
		alias: "withdraw_user_wallet_api_wallets_withdraw_post",
		description: `Withdraw wallet`,
		requestFormat: "json",
		parameters: [
			{
				name: "wallet_id",
				type: "Query",
				schema: z.number().int()
			},
			{
				name: "spl_token_address",
				type: "Query",
				schema: z.string()
			},
			{
				name: "amount",
				type: "Query",
				schema: z.number().gt(0)
			},
			{
				name: "destination",
				type: "Query",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
    return new Zodios(baseUrl, endpoints, options);
}
