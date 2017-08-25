function Board(data, isOwner, ref, stgRef) {
    data = data || {cards:[]};
    this.data = data;
    this.isOwner = isOwner;
    this.ref = ref;
    this.stgRef = stgRef;
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
        var board = this;
        var cards = board.data.cards;
        Object.keys(cards).forEach(function(key) {
            var cardRef = board.ref.child('cards/'+key);
            var card = new Card(cards[key], board, cardRef);
            card.create();
            board.cards.push(card);
        });
        return this;
    },
    refreshCards: function(newData) {
        this.data.cards = newData || [];
        this.cards = [];
        while (this.boardEl.lastChild) {
            this.boardEl.removeChild(this.boardEl.lastChild);
        }
        this.drawAllCards();
    },
    addCard: function(cardObj) {
        var cardRef = this.ref.child('cards').push();
        cardRef.set(cardObj);
        var card = new Card(cardObj, this, cardRef);
        card.create();
        this.cards.push(card);
        this.data.cards[cardRef.key] = cardObj;
    },
    removeSelectedCard: function() {
        if (!this.selectedCard) return;
        var key = this.selectedCard.ref.key;
        var fileName = this.selectedCard.data.imageName;
        this.cards = this.cards.filter(function(o){return o.ref.key !== key});
        if (fileName) {
            this.stgRef.child(fileName).delete();
        }
        this.selectedCard.destroy();
        this.selectCard(null);
    },
    setListeners: function() {
        var board = this;

        if (!this.isOwner) {
            this.ref.child('cards').on('value', function(snapshot) {
                board.refreshCards(snapshot.val());
            });
            return;
        }

        this.boardEl.ondblclick = function(ev) {
            var x = ev.clientX - 150;
            var y = ev.clientY - 50;
            var title = prompt('Title of the card: ');
            if (!title) return;
            var cardObj = {
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
    destroy: function() {
        this.boardEl.parentNode.removeChild(this.boardEl);
        this.boardEl = null;
        this.ref.child('cards').off();
        document.onkeyup = null;
    }
};

