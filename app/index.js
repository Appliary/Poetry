#!/usr/bin/env node

var appl = require( 'commander' );

appl.command( 'new' )
    .description( '╭───[ Generate structure from template ]───╮' )
    .action( require( './new' ) );

appl.command( 'new:project' )
    .description( '│  New project                             │' )
    .action( require( './new/project' ) );

appl.command( 'new:microservice' )
    .description( '│  New microservice                        │' )
    .action( require( './new/microservice' ) );

appl.command( 'new:app' )
    .description( '│  New front-end angular application       │' )
    .action( require( './new/app' ) );


appl.command( 'new:theme' )
    .description( '│  New theme                               │' )
    .action( require( './new/theme' ) );

appl.command( ' ' )
    .description( '╰──────────────────────────────────────────╯\n' )
    .action( ()=>{} );

appl.command( 'run' )
    .description( '╭───[ Start the project/microservice/… ]───╮' )
    .action( require( './run' ) );

appl.command( 'run:node' )
    .description( '│  Run locally ( only microservice/theme ) │' )
    .action( require( './run/node' ) );

appl.command( 'run:docker' )
    .description( '│  Run on docker                           │' )
    .action( require( './run/docker' ) );

appl.command( '' )
    .description( '╰──────────────────────────────────────────╯' )
    .action( ()=>{} );

appl.command( 'help' )
    .alias( '*' )
    .description( 'Show this help list' )
    .action( ( env ) => {
        if ( typeof env == 'string' )
            console.error( ' /!\\ Command not found :', env )
        appl.outputHelp();
    } );

appl.version( process.env.npm_package_version )
    .parse( process.argv );
