import {useRouteLoaderData, json, redirect, defer, Await} from 'react-router-dom';
import EventItem from "../components/EventItem.jsx";
import EventsList from "../components/EventsList.jsx";
import {Suspense} from "react";

const EventDetailPage = () => {
    const {event, events} = useRouteLoaderData('event-detail');

    return (
        <>
            <Suspense fallback={<p style={{textAlign: "center"}}>Loading...</p>}>
                <Await resolve={event}>
                    {(loadedEvent) => <EventItem event={loadedEvent}/>}
                </Await>
            </Suspense>
            <Suspense fallback={<p style={{textAlign: "center"}}>Loading...</p>}>
                <Await resolve={events}>
                    {(loadedEvents) => <EventsList events={loadedEvents}/>}
                </Await>
            </Suspense>
        </>
    )
}

export default EventDetailPage;

const loadEvent = async (id) => {
    const response = await fetch("http://localhost:8080/events/" + id);

    if (!response.ok) {
        throw json({message: "Could not fetch details for selected event."}, {status: 500})
    } else {
        const resData = await response.json();
        return resData.event;
    }
}

export const loadEvents = async () => {
    const response = await fetch('http://localhost:8080/events');

    if (!response.ok) {
        /*return {
            isError: true,
            message: "Could not fetch events."
        };*/
        /*throw new Response(JSON.stringify({message: "Could not fetch events."}), {status: 500});*/
        throw json({message: "Could not fetch events."}, {status: 500});
    } else {
        const resData = await response.json();
        console.log(resData.events)
        return resData.events;
    }
}

export const loader = async ({request, params}) => {
    const id = params.eventId;

    return defer({
        event: loadEvent(id),
        events: loadEvents(),
    })
}

export const action = async ({params, request}) => {
    const eventId = params.eventId;

    const token = getAuthToken();
    const response = await fetch('http://localhost:8080/events/' + eventId, {
        method: request.method,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw json({message: "Could not save event."}, {status: 500})
    }

    return redirect("/events");
}
