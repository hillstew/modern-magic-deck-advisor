import React, { Component } from 'react';
import '../styles/main.scss';
import Card from '../Card/Card.js';
import Header from '../Header/Header.js';
import Deck from '../Deck/Deck.js';

class CardArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popUpCard: {},
      cardsInDeck: []
    };
  }

  getPriceString = (num) => {
    return num.toFixed(2);
  }

  sortCards(cards) {
    return cards.map(userCard => {
      return (
        <Card
          card={userCard}
          key={userCard.cardName}
          cardAreaView={this.props.cardAreaView}
          displayPopUp={this.displayPopUp}
          getPriceString={this.getPriceString}
        />
      );
    });
  }

  sortDecks(decks) {
    decks.sort((a, b) => a.price - b.price);
    return decks.map(userDeck => {
      return (
        <Deck
          userDeck={userDeck}
          key={userDeck.deckName}
          expandDeck={this.expandDeck}
          setCardAreaView={this.props.setCardAreaView}
          addToFaveDecks={this.props.addToFaveDecks}
          cardAreaView={this.props.cardAreaView}
          cards={this.props.cards}
        />
      );
    });
  }

  displayPopUp = card => {
    this.setState({ popUpCard: card },
      this.props.setPopUpView(true));
  };

  returnToScreen = () => {
    this.props.setPopUpView(false);
  };

  expandDeck = deckObj => {
    const cardsInDeck = this.props.getExpandedDeckInfo(deckObj);
    cardsInDeck.map(cardInDeck => {
      const matchedCard = this.props.userCardsData.find(userCard => {
        return userCard.cardName === cardInDeck.cardName;
      });
      cardInDeck.requiredCount = deckObj.cardCounts[cardInDeck.cardName];
      cardInDeck.userCount = matchedCard
        ? Math.min(cardInDeck.requiredCount, matchedCard.cardCount)
        : 0;
      return cardInDeck;
    });
    this.setState({ cardsInDeck });
  };

  displayDeck = () => {
    return this.state.cardsInDeck.map(card => {
      return (
        <Card
          card={card}
          key={card.cardName}
          cardAreaView={this.props.cardAreaView}
          displayPopUp={this.displayPopUp}
          addToWishlist={this.props.addToWishlist}
          getPriceString={this.getPriceString}
        />
      );
    });
  };

  render() {
    let cardAreaView = [];
    switch (this.props.cardAreaView) {
      case 'compareDecks':
        cardAreaView = this.sortDecks(this.props.userDecks);
        break;
      case 'expandedDeck':
        cardAreaView = this.displayDeck();
        break;
      case 'faveDecks':
        cardAreaView = this.sortDecks(this.props.faveDecks);
        break;
      case 'wishList':
        cardAreaView = this.sortCards(this.props.wishList);
        break;
      default:
        cardAreaView = this.sortCards(this.props.userCardsData);
        break;
    }

    return (
      <div className="card-area">
        {this.props.popUpView && (
          <div className="popup--div">
            <img
              className="popup--card-image"
              src={this.state.popUpCard.imageSource}
              alt={this.state.popUpCard.cardName}
            />
            <div className="popup--info">
              <div>
                <h1>{this.state.popUpCard.cardName}</h1>
                <h2>${this.state.popUpCard.price}</h2>
                <div className="popup--div-scroll">
                  {this.state.popUpCard.decks.length > 0 && 
                    <p>Played in main deck of:</p>}
                  <ul className="popup--list">
                    {this.state.popUpCard.decks.map(deck => {
                      return <li key={deck}>{deck}</li>;
                    })}
                  </ul>
                  {this.state.popUpCard.sideboards.length > 0 && 
                    <p>Played in sideboard of:</p>}
                  <ul className="popup--list">
                    {this.state.popUpCard.sideboards.map(deck => {
                      return <li key={deck}>{deck}</li>;
                    })}
                  </ul>
                </div>
              </div>
              <i
                onClick={this.returnToScreen}
                className="far fa-times-circle"
              />
            </div>
          </div>
        )}
        <Header
          setAsideView={this.props.setAsideView}
          setCardAreaView={this.props.setCardAreaView}
        />
        <section className="card-area--section">{cardAreaView}</section>
      </div>
    );
  }
}

export default CardArea;
