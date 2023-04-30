import { TypeWriter } from "../controls/typewriter.js";

class Hod {
    constructor(player) {
        this.Player = player;

        this.Coins = 0;
        this.CoinsToAdd = 0;

        this.CoinsCounter = 0;
        this.CoinsSize = 40;

        this.CoinsFont = "30px 'Default'";
        this.CoinsFontColor = 'black';
        this.CurrentMessage = "";

        this.TypeWriter = new TypeWriter(window.innerWidth / 2, window.innerHeight / 5, "center");
        this.IsShowingBlackBars = false;
        this.IsHiddingBlackBars = false;
    }

    ShowBlackBars() {
        this.blackBarsCurrentHeight = 0;
        this.BlackBarsHeight = window.innerHeight / 4;
        this.blackBarsWidth = window.innerWidth;
        this.IsShowingBlackBars = true;
    }

    HideBlackBars() {
        this.IsHiddingBlackBars = true;
        this.blackBarsCurrentHeight = window.innerHeight / 4;
        this.BlackBarsHeight = 0;
        this.blackBarsWidth = window.innerWidth;
    }

    Update(deltaTime) {
        this.CoinsCounter++;
        if (this.CoinsCounter % 4 === 0) {
            if (this.Player.Coins !== this.Coins) {
                this.Coins++;
                this.CoinsFont = "40px 'Default'";
                this.CoinsFontColor = 'red';
            }
            else {
                this.CoinsFont = "30px 'Default'";
                this.CoinsFontColor = 'black';
            }
        }

        if (this.IsShowingBlackBars) {
            if (this.blackBarsCurrentHeight < this.BlackBarsHeight) this.blackBarsCurrentHeight += 2;
        }
        if (this.IsHiddingBlackBars) {
            if (this.blackBarsCurrentHeight > this.BlackBarsHeight) this.blackBarsCurrentHeight -= 2;
        }
        if (this.IsHiddingBlackBars && this.blackBarsCurrentHeight == this.BlackBarsHeight) {
            this.IsShowingBlackBars = false;
            this.IsHiddingBlackBars = false;
        }

        this.TypeWriter.Update();


    }

    ShowMessage(message) {
        this.TypeWriter.ShowText(message);
    }

    Draw(context) {
        context.fillStyle = 'white';
        context.fillRect(10, 10, 100, 10);
        context.fillStyle = 'green';
        context.fillRect(10, 10, this.Player.Health, 10);
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.strokeRect(10, 10, 100, 10);

        context.strokeStyle = 'white';
        context.strokeText(this.Coins, 40, 50);
        context.fillStyle = this.CoinsFontColor;
        context.font = this.CoinsFont;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.Coins, 40, 50);

        this.TypeWriter.Draw(context);
        if (this.IsShowingBlackBars) {
            context.fillStyle = "black"
            context.fillRect(0, 0, this.blackBarsWidth, this.blackBarsCurrentHeight);
            context.fillRect(0, window.innerHeight - this.blackBarsCurrentHeight, this.blackBarsWidth, this.blackBarsCurrentHeight);
        }
    }

};
export { Hod };