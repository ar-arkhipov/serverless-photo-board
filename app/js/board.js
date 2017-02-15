function Board(data) {
    this.data = data;
    this.cards = [];
    this.boardEl = document.createElement('div');
    this.boardEl.className = 'board';
}

Board.prototype = {
    constructor: Board,
    create: function() {
        var body = document.body;
        body.appendChild(this.boardEl);
        return this;
    },
    drawAllCards: function() {
        var i, length = this.data.cards.length;
        for (i=0; i < length; i++) {
            var card = new Card(this.data.cards[i], this);
            card.create();
            this.cards.push(card);
        }
        return this;
    },
    addCard: function(cardObj) {
        this.data.cards.push(cardObj);
        var card = new Card(cardObj, this);
        card.create();
        this.cards.push(card);
        this.save();
    },
    removeSelectedCard: function() {
        if (!this.selectedCard) return;
        var selectedId = this.selectedCard.id;
        this.data.cards = this.data.cards.filter(function(o){return o.id !== selectedId});
        this.cards = this.cards.filter(function(o){return o.id !== selectedId});
        this.save();
        this.selectedCard.destroy();
        this.selectCard(null);
    },
    setListeners: function() {
        var board = this;

        this.boardEl.ondblclick = function(ev) {
            var x = ev.clientX - 150;
            var y = ev.clientY - 50;
            var title = prompt('Title of the card: ');
            if (!title) return;
            var cardObj = {
                id: board.findFreeCardId(),
                title: title,
                position: {
                    x: x,
                    y: y
                }
            };
            board.addCard(cardObj);
        };

        this.boardEl.onmousedown = function(ev) {
            ev.preventDefault();
            if (!ev.card) {
                board.selectCard(null);
                return;
            }
            board.selectCard(ev.card);

            var newX, newY;
            var draggable = board.selectedCard.cardEl;
            var shiftX = ev.clientX - draggable.getBoundingClientRect().left;
            var shiftY = ev.clientY - draggable.getBoundingClientRect().top;

            board.boardEl.onmousemove = function(ev) {
                newX = ev.clientX - shiftX;
                newY = ev.clientY - shiftY;
                draggable.style.left = newX + 'px';
                draggable.style.top = newY + 'px';
                ev.preventDefault();
            };
            board.boardEl.onmouseup = function() {
                finishDrag();
            };
            board.boardEl.onmouseleave = function() {
                finishDrag();
            };

            function finishDrag() {
                if (typeof newX != 'undefined') {
                    board.selectedCard.setPosition(newX, newY);
                    board.save();
                }
                board.boardEl.onmousemove = null;
                board.boardEl.onmouseleave = null;
                board.boardEl.onmouseup = null;
            }

            return false;
        };

        document.onkeyup = function(ev) {
            if (ev.keyCode == 46) board.removeSelectedCard();
        };
    },
    selectCard: function(card) {
        this.selectedCard = card;
        this.cards.forEach(function(c) {
            c.cardEl.className = 'card';
        });
        if (card) {
            card.cardEl.className = 'card selected';
        }
    },
    findFreeCardId: function() {
        var i, length = this.cards.length, id = 0;
        for (i=0; i < length; i++) {
            var card = this.cards[i];
            id = card.id > id ? card.id : id;
        }
        return id + 1;
    },
    save: function() {
        localStorage.setItem('board', JSON.stringify(this.data));
    }
};

