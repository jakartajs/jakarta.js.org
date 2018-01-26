import React from 'react';
import * as PropTypes from 'prop-types';
import classnames from 'classnames';
import Helmet from 'react-helmet';
import moment from 'moment';

import styles from './home.module.scss';
import HomepageHeader from '../components/HomepageHeader';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import AnchorButton from '../components/AnchorButton';

class EventsPage extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      site: PropTypes.shape({
        siteMetadata: PropTypes.shape({
          title: PropTypes.string,
          subtitle: PropTypes.string,
          description: PropTypes.string,
        }),
      }),
    }).isRequired,
  };

  static renderLoading() {
    return (
      <div className={styles.eventCard}>
        <p>Loading...</p>
      </div>
    );
  }

  static renderEvents(events) {
    return events.length !== 0 ? events.map(event => (
      <div className={styles.eventCard} key={event.id}>
        <h3 className={styles.eventCardHeading}>{event.name}</h3>
        <time dateTime={new Date(event.time).toISOString()}>
          {moment(event.time).format('LLLL')}
        </time>
        <address>
          {event.venue.name}<br />
          {event.venue.address_1}
        </address>
        <div style={{ marginTop: '1rem' }}>
          <AnchorButton href={event.link} newTab>Join Event</AnchorButton>
        </div>
      </div>
    )) : (
      <div className={styles.eventCard}>
        <p>There are no upcoming events at the moment.</p>
      </div>
    );
  }

  static renderErrors(errors) {
    return (
      <div className={styles.eventCard}>
        <h3 style={{ marginTop: 0 }}>Something bad happened.</h3>
        <p>{errors}</p>
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      errors: null,
      events: [],
    };
  }

  componentDidMount() {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // eslint-disable-next-line max-len
    const url = 'https://api.meetup.com/JakartaJS/events?photo-host=public&sig_id=246266290&sig=a6a15b58298cb18ec8fc6e0565d00e123030e325';
    fetch(proxyUrl + url, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then(res => res.json())
      .then(json => this.setState({
        loading: false,
        events: json,
      }))
      .catch(err => this.setState({
        loading: false,
        errors: err.stack,
      }));
  }

  render() {
    const { data } = this.props;
    const { loading, errors, events } = this.state;

    return (
      <main className={classnames(styles.main, styles.homepageMain)}>
        <Helmet
          title={`Events · ${data.site.siteMetadata.title}`}
          meta={[
            { name: 'description', content: data.site.siteMetadata.description },
            { property: 'og:title', content: 'Events' },
            { property: 'og:description', content: data.site.siteMetadata.description },
          ]}
        />
        <div className={classnames(styles.mainHeader)} />
        <HomepageHeader>
          <h1 className={styles.heading}>Events</h1>
        </HomepageHeader>
        <PageContainer>
          <Card className={styles.eventsPage}>
            <p className="lead">Our meetups are normally held on the 2nd or 3rd Tuesday of any month.</p>
            <h2>Upcoming Events</h2>
            {loading ? EventsPage.renderLoading() : EventsPage.renderEvents(events)}
            {errors ? EventsPage.renderErrors(errors) : null}

            <p>
              <AnchorButton href="https://www.meetup.com/JakartaJS/events/past/" newTab>
                View Past Events
              </AnchorButton>
            </p>
          </Card>
        </PageContainer>
      </main>
    );
  }
}

export default EventsPage;

export const query = graphql`
  query EventsPageQuery {
    site {
      siteMetadata {
        title
        subtitle
        description
      }
    }
  }
`;