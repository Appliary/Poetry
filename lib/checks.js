// Check for a node version
if( !process.versions || !process.versions.node )
    throw new Error('Not a valable Node environment');

// Get the node version
var node_ver = process.versions.node.split('.');
node_ver.map( function( part ) {
    return parseInt( part );
} );

if( node_ver[0] < 5 )
    throw new Error('Your version of node is too old. Please update to ^5.4');

if( node_ver[0] == 5 && node_ver[1] < 4)
    throw new Error('Your version of node is too old. Please update to ^5.4');
