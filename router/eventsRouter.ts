import express from "express"
import TokenVerifier from "../middlewares/TokenVerifier";
import {body , validationResult} from 'express-validator';
import {IEvent} from "../models/IEvent";
import Event from "../models/Event";
import {IUser} from "../models/IUser";
import User from "../models/User";

const eventsRouter:express.Router = express.Router();

/*
4.USAGE  : Upload an Event
 URL    : http://127.0.0.1:5000/event/upload
 Method : POST
 Fields : name , image , price , date , info , type
 Access  : PRIVATE
 */
eventsRouter.post('/upload',[
    body('name').not().isEmpty().withMessage('Name is Required'),
    body('image').not().isEmpty().withMessage('Image is Required'),
    body('price').not().isEmpty().withMessage('Price is Required'),
    body('date').not().isEmpty().withMessage('Date is Required'),
    body('info').not().isEmpty().withMessage('Info is Required'),
    body('type').not().isEmpty().withMessage('Type is Required'),
],TokenVerifier,async (request:express.Request,response:express.Response) => {
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({
            errors : errors.array()
        })
    }
    try{
        let { name , image , price , date , info , type } = request.body;
        // Check if event with the same name
        let events:IEvent | null = await Event.findOne({name : name});
        if(events){
            return response.status(400).json({
                errors : [
                    {msg : 'Event is Already Exist'}
                ]
            });
        }
        // create an event
        events = new Event ({name , image , price , date , info , type});
        events = await events.save();
        response.status(200).json({
            msg:'Upload Event is Success'
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            errors:[
                {
                    msg:error
                }
            ]
        })
    }
});



/*
5.USAGE: Get all Free Events
URL    : http://127.0.0.1:5000/event/free
Method : GET
Fields : no-fields
Access : PUBLIC
*/
eventsRouter.get('/free',async (request:express.Request,response:express.Response) => {
    try{
        let events:IEvent[] | null = await Event.find({type:"FREE"});
        if(!events){
            return response.status(400).json({
                errors : [
                    {msg : 'NO Events Found'}
                ]
            });
        }
        response.status(200).json({
            events:events
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            errors:[
                {
                    msg:error
                }
            ]
        })
    }
});



/*
  6.USAGE  : Get all PRO Events
 URL    : http://127.0.0.1:5000/event/pro
 Method : GET
 Fields : no-fields
 Acess  : PUBLIC
*/
eventsRouter.get('/pro',async (request:express.Request,response:express.Response) => {
    try{
        let events:IEvent[] | null = await Event.find({type:"PRO"});
        if(!events){
            return response.status(400).json({
                errors : [
                    {msg : 'NO Events Found'}
                ]
            });
        }
        response.status(200).json({
            events:events
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            errors:[
                {
                    msg:error
                }
            ]
        })
    }
});


/*
    7.USAGE  : Get a Single Event
 URL    : http://127.0.0.1:5000/event/:eventId
 Method : GET
 Fields : no-fields
 Access  : PUBLIC
 */
eventsRouter.get('/:eventId',async (request:express.Request,response:express.Response) => {
    try{
        let {eventId}=request.params;
        //TODO Get a Single Event
        response.status(200).json({
            msg:'Get a Single Event'
        })
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            errors:[
                {
                    msg:error
                }
            ]
        })
    }
});

export default eventsRouter;