import Head from 'next/head'
import React from 'react'

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    return { host: req.headers.host };
  }
  render () {
    const { host } = this.props;

    return (
    <div>

        <Head>
            <title>Timestamp microservice</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
        </Head>
        <div className="container">
            <h1 className="header">
                FreeCodeCamp API Basejump: URL Shortener Microservice
            </h1>
            <blockquote>
                User stories:
                <ul>1) I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.</ul>
                <ul>2) When I visit that shortened URL, it will redirect me to my original link.</ul>
            </blockquote>
            <h3>Example usage:</h3>
            <code>https://{host}/new/https://www.google.com</code><br />
            <code>https://{host}/new/http://foo.com:80</code>
            <h3>Example creation output</h3>
            <code>{'{'} "original_url":"http://foo.com:80", "short_url":`https://{host}/9cgu` {'}'}</code>
            <h3>Usage:</h3>
            <code>https://{host}/9cf6</code>
            <h3>Will redirect to:</h3>
            <code>https://www.google.com/</code>
        </div>
    </div>
    )
  }
}
