import {BlocksController} from "./controller/BlocksController";
import {EventsController} from "./controller/EventsController";
import {ExtrinsicsController} from "./controller/ExtrinsicsController";
import { PointController } from "./controller/PointController";

export const Routes = [
{
    method: "post",
    route: "/api/scan/transfers",
    controller: ExtrinsicsController,
    action: "getTransfers"
}, {
    method: "post",
    route: "/api/scan/account/reward_slash",
    controller: EventsController,
    action: "getRewardSlash"
}, {
    method: "post",
    route: "/api/scan/extrinsics",
    controller: ExtrinsicsController,
    action: "getExtrinsics"
}, {
    method: "post",
    route: "/api/now",
    controller: BlocksController,
    action: "getTimestamp"
}, {
    method: "post",
    route: "/api/scan/blocks",
    controller: BlocksController,
    action: "getBlocks"
}, {
    method: "post",
    route: "/api/scan/block",
    controller: BlocksController,
    action: "getBlock"
}, {
    method: "post",
    route: "/api/scan/extrinsic",
    controller: ExtrinsicsController,
    action: "getExtrinsic"
}, {
    method: "post",
    route: "/api/scan/staking_history",
    controller: EventsController,
    action: "getStakingHistory"
}, {
    method: "get",
    route: "/api/scan/block_height",
    controller: BlocksController,
    action: "getBlockHeight"
}, {
    method: "post",
    route: "/api/scan/points",
    controller: PointController,
    action: "getPoints"
}
];
