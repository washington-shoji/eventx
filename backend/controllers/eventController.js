const Event = require( '../models/eventModel' );
const asyncHandler = require( 'express-async-handler' );

/*
This is a "controller" (a logic model) where the business logic will occur 
between the entity and API (service layer). 
*/

const getEvents = asyncHandler( async ( req, res ) => {
    const events = await Event.find( { user: req.user._id } );
    res.json( events );
} );

const createEvent = asyncHandler( async ( req, res ) => {
    const { title, content, category, pic } = req.body;

    // TODO: Add picture
    if ( !title || !content || !category || !pic ) {
        res.status( 400 );
        throw new Error( 'Please fill all the fields' );
        return;
    } else {
        const event = new Event( { user: req.user._id, title, content, category, pic } );
        const createEvent = await event.save();

        res.status( 201 ).json( createEvent );
    }
} );


const getEventById = asyncHandler( async ( req, res ) => {
    const event = await Event.findById( req.params.id );

    if ( event ) {
        res.json( event );
    } else {
        res.status( 404 ).json( { message: "Event not found" } );
    }

} );

const updateEvent = asyncHandler( async ( req, res ) => {
    const { title, content, category, pic } = req.body;
    const event = await Event.findById( req.params.id );

    if ( event.user.toString() !== req.user._id.toString() ) {
        res.status( 401 );
        throw new Error( "You cannot perform this action" );
    }

    if ( event ) {
        event.title = title;
        event.content = content;
        event.category = category;
        event.pic = pic;

        const updatedEvent = await event.save();
        res.json( updatedEvent );
    } else {
        res.status( 404 );
        throw new Error( "Event not found" );
    }

} );

const deleteEvent = asyncHandler( async ( req, res ) => {
    const event = await Event.findById( req.params.id );

    if ( event.user.toString() !== req.user._id.toString() ) {
        res.status( 401 );
        throw new Error( "You cannot perform this action" );
    }

    if ( event ) {
        await event.remove();
        res.json( { message: "Event removed" } );
    } else {
        res.status( 404 );
        throw new Error( "Event not found" );
    }

} );

module.exports = { getEvents, createEvent, getEventById, updateEvent, deleteEvent };