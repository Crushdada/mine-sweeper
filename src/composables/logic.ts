import { BlockState } from "~/types";
// block周围的方向
const directions = [
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
];
export class GamePlay {
    mineGenerated = false; // 是否生成炸弹
    /**
    * 为了工程化,采用ref而不是reactive
    * 我们可能需要移除或更新整个state,而reactive会阻止这样做--antf大佬如是说
    **/
    state = ref<BlockState[][]>([]);
    constructor(public width: number, public hight: number) {
        // 追踪插旗、翻开块的变动，应用检查游戏状态的副作用
        watch(this.state.value, this.checkGameState);
        this.reset();
    }
    // 重置游戏状态
    reset() {
        this.mineGenerated = false;
        this.state.value = Array.from({ length: this.hight }, (_, x) =>
            Array.from(
                { length: this.width },
                (_, y): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
            )
        );
    }


    // 检查游戏状态
    checkGameState() {
        if (!this.mineGenerated) return;
        const blocks = this.state.value.flat();
        const win = blocks.every(
            (block) =>
                (!block.revealed && block.flagged) || block.revealed || block.mine
        );
        if (win) {
            alert("You Win!");
        }
    }
    // 随机生成炸弹
    generateMines(initial: BlockState) {
        for (const row of this.state.value) {
            for (const block of row) {
                // 保证首次点击的block的周遭为空
                if (Math.abs(initial.x - block.x) <= 1) continue;
                if (Math.abs(initial.y - block.y) <= 1) continue;
                block.mine = Math.random() < 0.3;
            }
        }
        this.updateMineNums();
    }
    // 计算每个block周围的炸弹数
    updateMineNums() {
        this.state.value.forEach((row) => {
            row.forEach((block) => {
                if (block.mine) return;
                this.getSiblings(block).forEach((b) => {
                    if (b.mine) block.adjacentMines += 1;
                });
            });
        });
    }

    // 小帮手：当你翻开一个空的块，游戏会帮你翻开它周遭的空块，并递归这个过程
    expandZero(block: BlockState) {
        if (block.adjacentMines) return;
        // 如果当前块周遭无炸弹
        this.getSiblings(block).forEach((s) => {
            if (!s.revealed) {
                s.revealed = true;
                this.expandZero(s);
            }
        });
    }
    // 获得block周遭的块
    getSiblings(block: BlockState) {
        return directions
            .map(([dx, dy]) => {
                const x = block.x + dx;
                const y = block.y + dy;
                if (x < 0 || x >= this.width || y < 0 || y >= this.hight) return;
                return this.state.value[x][y];
            })
            .filter(Boolean) as BlockState[];
    }
    // block鼠标右键点击事件
    onRightClick(block: BlockState) {
        if (block.revealed) return;
        block.flagged = !block.flagged;
    }
    // block鼠标左键点击事件
    onClick(block: BlockState) {
        if (!this.mineGenerated) {
            this.generateMines(block);
            this.mineGenerated = true;
        }
        block.revealed = true;
        if (block.mine) {
            alert("Boooom!");
            return;
        }
        this.expandZero(block);
    }
}