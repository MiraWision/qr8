import { Observer } from '../observer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EventMessage<T> = { event: string, payload: { previousState: T, currentState: T } };
type EventCondition<T> = (previousState: T, currentState: T) => boolean;

/**
 * Named Event Interface
 * 
 * Defines a named event with a condition function that determines when the event should be triggered.
 * The condition function receives previous and current state and returns a boolean indicating if the event should fire.
 */
interface NamedEvent<T> {
  name: string;
  condition: EventCondition<T>;
}

/**
 * Event Subscription Interface
 * 
 * Represents a subscription to a specific named event with a callback function.
 */
interface EventSubscription<T> {
  eventName: string;
  callback: (previousState: T, currentState: T) => void;
}

/**
 * Deep Merge Utility Function
 * 
 * Recursively merges objects, arrays, and primitive values.
 * Handles nested object structures while preserving existing data.
 * Supports deep state updates for complex nested structures.
 * 
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns The merged object
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = result[key];
      const sourceValue = source[key];

      if (sourceValue === undefined) {
        continue;
      }

      if (sourceValue === null) {
        (result as any)[key] = null;
        continue;
      }

      if (Array.isArray(sourceValue)) {
        (result as any)[key] = sourceValue;
        continue;
      }

      if (typeof sourceValue === 'object' && sourceValue !== null && 
          typeof targetValue === 'object' && targetValue !== null && 
          !Array.isArray(targetValue)) {
        (result as any)[key] = deepMerge(targetValue, sourceValue);
      } else {
        (result as any)[key] = sourceValue;
      }
    }
  }

  return result;
}

/**
 * Cache Configuration Interface
 * 
 * Defines which parts of the state should be cached and how.
 * Allows selective caching of specific state properties while excluding others.
 * Provides granular control over what data persists across sessions.
 */
interface CacheConfig {
  enabled: boolean;
  cacheKeys: (keyof any)[];
  storageKey?: string;
  version?: string;
}

/**
 * Request State Interface
 * 
 * Defines the complete lifecycle state of an API request operation.
 * Tracks loading status, success/failure outcomes, error messages, and completion status.
 * Used for comprehensive request state management across the application.
 */
interface RequestState {
  loading: boolean;
  success: boolean;
  error: string | null;
  finished: boolean;
}

/**
 * Requests State Interface
 * 
 * Manages multiple concurrent API requests within a single Wing instance.
 * Provides indexed access to individual request states by request name.
 * Enables tracking of multiple simultaneous operations (e.g., fetch, save, delete).
 */
interface RequestsState {
  [requestName: string]: RequestState;
}

/**
 * Base State Interface with Requests
 * 
 * Extends any application state with optional request state management.
 * Automatically provides request tracking capabilities to all Wing instances.
 * Maintains type safety while adding request management functionality.
 */
interface BaseState {
  requests?: RequestsState;
}

/**
 * Enhanced Wing Class - Advanced State Management with Deep Merge, Request Lifecycle Tracking and Local Storage Caching
 * 
 * A sophisticated state management system that extends the Observer pattern with
 * comprehensive API request lifecycle management, deep merge capabilities, and intelligent local storage caching.
 * Provides automatic state tracking, event-driven updates, and seamless integration with React components.
 * 
 * Key Features:
 * - Deep merge state updates supporting nested structures (e.g., { requests: { fetchNotebooks: { loading: true } } })
 * - Automatic request state management (loading, success, error, finished)
 * - Event-driven state updates with conditional notifications
 * - Named events with conditions for fine-grained event handling
 * - Subscribe/unsubscribe to specific named events
 * - Type-safe state management with generics
 * - Built-in error handling and recovery
 * - Concurrent request tracking
 * - Observer pattern integration for reactive updates
 * - Local storage caching with selective data persistence
 * - Cache versioning and migration support
 * - Automatic cache invalidation and cleanup
 * 
 * Usage:
 * ```typescript
 * class UserService extends Wing<UserState> {
 *   constructor() {
 *     super({
 *       users: [],
 *       settings: {},
 *       requests: {}
 *     }, {
 *       enabled: true,
 *       cacheKeys: ['users', 'settings'], // Cache only users and settings
 *       storageKey: 'user-service-cache',
 *       version: '1.0.0'
 *     });
 *     
 *     // Define named events
 *     this.defineEvent('userAdded', (prev, curr) => curr.users.length > prev.users.length);
 *     this.defineEvent('settingsChanged', (prev, curr) => JSON.stringify(prev.settings) !== JSON.stringify(curr.settings));
 *   }
 * 
 *   async fetchUsers() {
 *     return this.executeRequest('fetchUsers', 
 *       () => api.getUsers(),
 *       (users) => this.setState({ users }),
 *       (error) => console.error(error)
 *     );
 *   }
 * 
 *   // Deep nested state updates
 *   setLoadingState() {
 *     this.setState({
 *       requests: {
 *         fetchNotebooks: {
 *           loading: true
 *         }
 *       }
 *     });
 *   }
 * }
 * ```
 */
class Wing<T extends BaseState> extends Observer<EventMessage<T>> {
  protected state: T;
  protected actions: Record<string, Function> = {};
  protected events: Record<string, EventCondition<T>> = {};
  protected namedEvents: Record<string, NamedEvent<T>> = {};
  protected eventSubscriptions: EventSubscription<T>[] = [];
  protected cacheConfig: CacheConfig;
  protected cacheVersion: string = '1.0.0';

  /**
   * Default Request State Template
   * 
   * Immutable template for creating new request states.
   * Ensures consistency across all request state initializations.
   * Provides a standardized starting point for request lifecycle tracking.
   */
  protected static readonly defaultRequest: RequestState = {
    loading: false,
    success: false,
    error: null,
    finished: false,
  };

  /**
   * Batch Request State Initialization
   * 
   * Creates default request states for multiple concurrent operations.
   * Useful for initializing multiple request trackers at once.
   * 
   * @param requestNames - Array of request identifiers to initialize
   * @returns RequestsState - Object containing default states for each request
   */
  protected createDefaultRequests(requestNames: string[]): RequestsState {
    const requests: RequestsState = {};
    requestNames.forEach(name => {
      requests[name] = { ...Wing.defaultRequest };
    });
    return requests;
  }

  /**
   * Wing Constructor with State Initialization and Cache Configuration
   * 
   * Initializes the Wing instance with the provided state and cache configuration.
   * Automatically loads cached data if available and cache is enabled.
   * Sets up the observer pattern for state change notifications.
   * 
   * @param initialState - The initial state for this Wing instance
   * @param cacheConfig - Optional cache configuration for local storage persistence
   */
  constructor(initialState: T, cacheConfig?: CacheConfig) {
    super();

    // Initialize cache configuration with defaults
    this.cacheConfig = {
      enabled: false,
      cacheKeys: [],
      storageKey: 'wing-cache',
      version: this.cacheVersion,
      ...cacheConfig
    };

    // Ensure requests state is always included
    const stateWithRequests = {
      ...initialState,
      requests: initialState.requests || {},
    };

    // Initialize state first
    this.state = stateWithRequests;
    
    // Load cached data if cache is enabled (async)
    if (this.cacheConfig.enabled) {
      this.loadFromCache().then(cachedState => {
        if (cachedState) {
          // Merge cached data with current state, prioritizing cached data for specified keys
          const mergedState = { ...this.state };
          this.cacheConfig.cacheKeys.forEach(key => {
            // @ts-ignore
            if (cachedState[key] !== undefined) {
              // @ts-ignore
              (mergedState as any)[key] = cachedState[key];
            }
          });
          this.state = mergedState;
          // Trigger a state update to notify subscribers
          this.notify({ event: 'UPDATE', payload: { previousState: stateWithRequests, currentState: this.state } });
        }
      }).catch(error => {
        console.warn('Failed to load cached state:', error);
      });
    }
  }

  /**
   * Define a Named Event
   * 
   * Registers a named event with a condition function that determines when the event should be triggered.
   * The condition function receives previous and current state and returns a boolean.
   * 
   * @param eventName - Unique name for the event
   * @param condition - Function that determines when the event should fire
   */
  public defineEvent(eventName: string, condition: EventCondition<T>): void {
    this.namedEvents[eventName] = {
      name: eventName,
      condition
    };
  }

  /**
   * Subscribe to a Named Event
   * 
   * Subscribes to a specific named event with a callback function.
   * The callback will be called when the event condition is met during state changes.
   * 
   * @param eventName - Name of the event to subscribe to
   * @param callback - Function to call when the event is triggered
   * @returns Function to unsubscribe from the event
   */
  public subscribeToEvent(eventName: string, callback: (previousState: T, currentState: T) => void): () => void {
    // Check if the event is defined
    if (!this.namedEvents[eventName]) {
      console.warn(`Event "${eventName}" is not defined. Make sure to define it first using defineEvent().`);
      return () => {}; // Return empty unsubscribe function
    }

    const subscription: EventSubscription<T> = {
      eventName,
      callback
    };

    this.eventSubscriptions.push(subscription);

    // Return unsubscribe function
    return () => {
      const index = this.eventSubscriptions.findIndex(sub => 
        sub.eventName === eventName && sub.callback === callback
      );
      if (index !== -1) {
        this.eventSubscriptions.splice(index, 1);
      }
    };
  }

  /**
   * Unsubscribe from a Named Event
   * 
   * Removes a specific subscription from an event.
   * 
   * @param eventName - Name of the event to unsubscribe from
   * @param callback - The callback function to remove
   */
  public unsubscribeFromEvent(eventName: string, callback: (previousState: T, currentState: T) => void): void {
    const index = this.eventSubscriptions.findIndex(sub => 
      sub.eventName === eventName && sub.callback === callback
    );
    if (index !== -1) {
      this.eventSubscriptions.splice(index, 1);
    }
  }

  /**
   * Get All Named Events
   * 
   * Returns all defined named events for this Wing instance.
   * 
   * @returns Record<string, NamedEvent<T>> - All defined named events
   */
  public getNamedEvents(): Record<string, NamedEvent<T>> {
    return { ...this.namedEvents };
  }

  /**
   * Get Event Subscriptions
   * 
   * Returns all current event subscriptions for this Wing instance.
   * 
   * @returns EventSubscription<T>[] - All current event subscriptions
   */
  public getEventSubscriptions(): EventSubscription<T>[] {
    return [...this.eventSubscriptions];
  }

  /**
   * Advanced State Update Method with Deep Merge, Event Notification and Cache Persistence
   * 
   * Updates the internal state using deep merge and triggers appropriate event notifications.
   * Supports deep nested state updates (e.g., { requests: { fetchNotebooks: { loading: true } } })
   * and conditional event firing based on registered event conditions. Maintains state immutability principles.
   * Automatically persists state changes to local storage if caching is enabled.
   * 
   * @param newState - Complete or partial state update with support for deep nesting
   */
  protected setState(newState: T | Partial<T>): void {
    const previousState = this.state;
    let updatedState: T;
    try {
      updatedState = deepMerge(this.state, newState);
    } catch (error) {
      console.error('Error merging state:', error);
      updatedState = this.state;
    }

    this.state = updatedState;

    this.notify({ event: 'UPDATE', payload: { previousState, currentState: updatedState } });

    // Check legacy events
    for (const [event, condition] of Object.entries(this.events)) {
      if (condition(previousState, updatedState)) {
        this.notify({ event, payload: { previousState, currentState: updatedState }});
      }
    }

    // Check named events and notify subscribers
    for (const [eventName, namedEvent] of Object.entries(this.namedEvents)) {
      if (namedEvent.condition(previousState, updatedState)) {
        // Notify all subscribers for this event
        this.eventSubscriptions
          .filter(sub => sub.eventName === eventName)
          .forEach(sub => {
            try {
              sub.callback(previousState, updatedState);
            } catch (error) {
              console.error(`Error in event subscription for "${eventName}":`, error);
            }
          });
      }
    }

    // Persist to cache if enabled
    if (this.cacheConfig.enabled) {
      this.saveToCache().catch(error => {
        console.warn('Failed to save to cache:', error);
      });
    }
  }

  /**
   * AsyncStorage Cache Loading
   * 
   * Loads cached state from AsyncStorage if available and valid.
   * Performs version checking and data validation before restoring cached state.
   * 
   * @returns Partial<T> | null - Cached state or null if not available/invalid
   */
  private async loadFromCache(): Promise<Partial<T> | null> {
    try {
      const storageKey = this.cacheConfig.storageKey || 'wing-cache';
      const cached = await AsyncStorage.getItem(storageKey);
      
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      
      // Version check for cache migration
      if (parsed.version !== this.cacheConfig.version) {
        await this.clearCache();
        return null;
      }

      return parsed.data || null;
    } catch (error) {
      console.warn('Failed to load from cache:', error);
      await this.clearCache();
      return null;
    }
  }

  /**
   * AsyncStorage Cache Saving
   * 
   * Saves current state to AsyncStorage with version information.
   * Only caches specified keys from the cache configuration.
   * Includes metadata for cache validation and migration.
   * 
   */
  private async saveToCache(): Promise<void> {
    try {
      const storageKey = this.cacheConfig.storageKey || 'wing-cache';
      
      // Only cache specified keys
      const dataToCache: Partial<T> = {};
      this.cacheConfig.cacheKeys.forEach(key => {
        // @ts-ignore
        if (this.state[key] !== undefined) {
          // @ts-ignore
          (dataToCache as any)[key] = this.state[key];
        }
      });

      const cacheData = {
        version: this.cacheConfig.version,
        timestamp: Date.now(),
        data: dataToCache
      };

      await AsyncStorage.setItem(storageKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  }

  /**
   * Cache Invalidation and Cleanup
   * 
   * Clears the cached data from AsyncStorage.
   * Useful for forcing fresh data loading or handling cache corruption.
   * 
   */
  public async clearCache(): Promise<void> {
    try {
      const storageKey = this.cacheConfig.storageKey || 'wing-cache';
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Cache Status Check
   * 
   * Determines if cache is enabled and available for this Wing instance.
   * 
   * @returns boolean - True if cache is enabled and available
   */
  public isCacheEnabled(): boolean {
    return this.cacheConfig.enabled;
  }

  /**
   * Cache Configuration Getter
   * 
   * Returns the current cache configuration for this Wing instance.
   * Useful for debugging and cache introspection.
   * 
   * @returns CacheConfig - Current cache configuration
   */
  public getCacheConfig(): CacheConfig {
    return { ...this.cacheConfig };
  }

  /**
   * Request Loading State Management
   * 
   * Transitions a specific request to loading state, indicating an active API call.
   * Resets success and error states while setting loading to true.
   * 
   * @param requestName - Unique identifier for the request being tracked
   */
  protected setRequestLoading(requestName: string): void {
    this.setState({
      requests: {
        [requestName]: {
          loading: true,
          success: false,
          error: null,
          finished: false,
        }
      }
    } as any);
  }

  /**
   * Request Success State Management
   * 
   * Transitions a specific request to success state upon successful completion.
   * Sets loading to false, success to true, and marks the request as finished.
   * 
   * @param requestName - Unique identifier for the request being tracked
   */
  protected setRequestSuccess(requestName: string): void {
    this.setState({
      requests: {
        [requestName]: {
          loading: false,
          success: true,
          error: null,
          finished: true,
        }
      }
    } as any);
  }

  /**
   * Request Error State Management
   * 
   * Transitions a specific request to error state upon failure.
   * Sets loading to false, success to false, stores the error message,
   * and marks the request as finished.
   * 
   * @param requestName - Unique identifier for the request being tracked
   * @param error - Human-readable error message describing the failure
   */
  protected setRequestError(requestName: string, error: string): void {
    this.setState({
      requests: {
        [requestName]: {
          loading: false,
          success: false,
          error,
          finished: true,
        }
      }
    } as any);
  }

  /**
   * Request State Reset
   * 
   * Resets a specific request to its default state, clearing all
   * previous outcomes and preparing it for a new operation.
   * 
   * @param requestName - Unique identifier for the request to reset
   */
  protected resetRequest(requestName: string): void {
    this.setState({
      requests: {
        [requestName]: { ...Wing.defaultRequest }
      }
    } as any);
  }

  /**
   * Comprehensive API Request Execution with State Management
   * 
   * Executes an API call with automatic state lifecycle management.
   * Handles the complete request flow: loading → success/error → finished.
   * Provides optional success and error callbacks for custom handling.
   * 
   * @param requestName - Unique identifier for tracking this request
   * @param apiCall - Async function that performs the actual API operation
   * @param onSuccess - Optional callback executed on successful completion
   * @param onError - Optional callback executed on error with error message
   * @returns Promise resolving to the API result or null on error
   */
  protected async executeRequest<TResult>(
    requestName: string,
    apiCall: () => Promise<TResult>,
    onSuccess?: (result: TResult) => void,
    onError?: (error: string) => void
  ): Promise<TResult | null> {
    this.setRequestLoading(requestName);

    try {
      const result = await apiCall();
      this.setRequestSuccess(requestName);
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      this.setRequestError(requestName, errorMessage);
      onError?.(errorMessage);
      return null;
    }
  }

  /**
   * Request State Retrieval
   * 
   * Retrieves the current state of a specific request by name.
   * Returns undefined if the request has not been tracked.
   * 
   * @param requestName - Unique identifier for the request
   * @returns RequestState or undefined if request not found
   */
  protected getRequestState(requestName: string): RequestState | undefined {
    return this.state.requests?.[requestName];
  }

  /**
   * Request Loading Status Check
   * 
   * Determines if a specific request is currently in loading state.
   * Useful for UI loading indicators and preventing duplicate requests.
   * 
   * @param requestName - Unique identifier for the request
   * @returns boolean indicating if request is currently loading
   */
  protected isRequestLoading(requestName: string): boolean {
    const requestState = this.getRequestState(requestName);
    return requestState?.loading || false;
  }

  /**
   * Request Success Status Check
   * 
   * Determines if a specific request completed successfully.
   * Useful for conditional UI rendering and success state handling.
   * 
   * @param requestName - Unique identifier for the request
   * @returns boolean indicating if request completed successfully
   */
  protected isRequestSuccess(requestName: string): boolean {
    const requestState = this.getRequestState(requestName);
    return requestState?.success || false;
  }

  /**
   * Request Error Message Retrieval
   * 
   * Retrieves the error message for a specific request if it failed.
   * Returns null if the request succeeded or hasn't been executed.
   * 
   * @param requestName - Unique identifier for the request
   * @returns Error message string or null if no error
   */
  protected getRequestError(requestName: string): string | null {
    const requestState = this.getRequestState(requestName);
    return requestState?.error || null;
  }

  /**
   * Request Completion Status Check
   * 
   * Determines if a specific request has finished (either success or error).
   * Useful for determining when to show results or error messages.
   * 
   * @param requestName - Unique identifier for the request
   * @returns boolean indicating if request has finished
   */
  protected isRequestFinished(requestName: string): boolean {
    const requestState = this.getRequestState(requestName);
    return requestState?.finished || false;
  }

  /**
   * Current State Getter
   * 
   * Returns the current state of this Wing instance.
   * Provides read-only access to the complete state including requests.
   * 
   * @returns T - The current state object
   */
  getState(): T {
    return this.state;
  }

  /**
   * Actions Getter
   * 
   * Returns all registered actions for this Wing instance.
   * Useful for debugging and action introspection.
   * 
   * @returns Record<string, Function> - All registered actions
   */
  getActions() {
    return this.actions;
  }

  /**
   * Events Getter
   * 
   * Returns all registered events and their conditions for this Wing instance.
   * Useful for debugging and event introspection.
   * 
   * @returns Record<string, EventCondition<T>> - All registered events
   */
  getEvents() {
    return this.events;
  }
}

export { Wing };
export type { EventMessage, EventCondition, NamedEvent, EventSubscription, RequestState, RequestsState, BaseState, CacheConfig };
