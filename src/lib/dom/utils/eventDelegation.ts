type EventHandler = (event: Event) => void;

/**
 * Handles event delegation for DOM elements, allowing efficient event management.
 */
class EventDelegation {
    private static instance: EventDelegation;
    private eventHandlers: Map<string, Map<HTMLElement, Set<EventHandler>>>;
    private attachedEvents: Set<string>;

    private constructor() {
        this.eventHandlers = new Map();
        this.attachedEvents = new Set();
    }

    static getInstance() {
        if (!EventDelegation.instance) {
            EventDelegation.instance = new EventDelegation();
        }
        return EventDelegation.instance;
    }

    /**
     * Adds an event listener to a DOM element for delegated handling.
     * @param {HTMLElement} element - The element to listen on
     * @param {string} eventType - The event type (e.g., 'click')
     * @param {EventHandler} handler - The event handler function
     */
    public addEventListener(element: HTMLElement, eventType: string, handler: EventHandler) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, new Map());

            if (!this.attachedEvents.has(eventType)) {
                document.addEventListener(eventType, this.handleEvent.bind(this));
                this.attachedEvents.add(eventType);
            }
        }

        const eventHandlers = this.eventHandlers.get(eventType)!;
        if (!eventHandlers.has(element)) {
            eventHandlers.set(element, new Set());
        }

        eventHandlers.get(element)!.add(handler);
    }

    /**
     * Removes a delegated event listener from a DOM element.
     * @param {HTMLElement} element - The element to remove the listener from
     * @param {string} eventType - The event type
     * @param {EventHandler} handler - The event handler function
     */
    public removeEventListener(element: HTMLElement, eventType: string, handler: EventHandler) {
        if (!this.eventHandlers.has(eventType)) return;

        const eventHandlers = this.eventHandlers.get(eventType)!;
        if (!eventHandlers.has(element)) return;

        const handlers = eventHandlers.get(element)!;
        handlers.delete(handler);

        if (handlers.size === 0) {
            eventHandlers.delete(element);

            if (eventHandlers.size === 0) {
                document.removeEventListener(eventType, this.handleEvent.bind(this));
                this.eventHandlers.delete(eventType);
                this.attachedEvents.delete(eventType);
            }
        }
    }

    /**
     * Handles a delegated event and dispatches to the correct handler(s).
     * @param {Event} event - The event object
     * @private
     */
    private handleEvent(event: Event) {
        const target = event.target as HTMLElement;
        if (!target) return;

        const eventType = event.type;
        const eventHandlers = this.eventHandlers.get(eventType);
        if (!eventHandlers) return;

        let currentElement: HTMLElement | null = target;

        while (currentElement) {
            if (eventHandlers.has(currentElement)) {
                const handlers = eventHandlers.get(currentElement)!;
                if (handlers.size > 0) {
                    handlers.forEach((handler) => {
                        handler(event);
                    });
                    break;
                }
            }
            currentElement = currentElement.parentElement;
        }
    }
}

/**
 * Singleton instance for event delegation.
 * @type {EventDelegation}
 */
export const eventDelegation = EventDelegation.getInstance();
