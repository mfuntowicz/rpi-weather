// Setup React-Relay
function fetchQuery(operation, variables, cacheConfig, uploadables) {
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            // Add authentication and other headers here
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            query: operation.text, // GraphQL text from input
            variables,
        }),
    }).then(response => {
        return response.json();
    });
}

// Create a network layer from the fetch function
const { Environment, Network, RecordSource, Store } = require('relay-runtime');
const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchQuery);


const environment = new Environment({
    network,
    store,
    source
});

export { environment }