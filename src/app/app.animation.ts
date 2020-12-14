import {
  trigger,
  animate,
  transition,
  style,
  group,
  query,
  state,
  stagger,
  keyframes,
} from '@angular/animations';

export const slideInAnimation = trigger('slideInAnimation', [
  // Transition between any two states
  transition('* <=> *', [
    // Events to apply
    // Defined style and animation function to apply
    // Config object with optional set to true to handle when element not yet added to the DOM
    query(
      ':enter, :leave',
      style({ position: 'fixed', width: '100%', zIndex: 2 }),
      { optional: true }
    ),
    // group block executes in parallel
    group([
      query(
        ':enter',
        [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s ease-out', style({ transform: 'translateX(0%)' })),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0%)' }),
          animate('0.5s ease-out', style({ transform: 'translateX(-100%)' })),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

export const fadeAnimation = trigger('fadeAnimation', [
  state('void', style({ opacity: 0 })),
  transition(':enter, :leave', [animate(2000)]),
]);
export const openAnimation = trigger('openAnimation', [
  state(
    '*',
    style({
      height: '*',
      opacity: 1,
    })
  ),
  state(
    'void',
    style({
      height: 0,
      opacity: 0,
    })
  ),
  transition('* <=> *', [animate('0.5s')]),
]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger('60ms', animate('600ms ease-out', style({ opacity: 1 }))),
      ],
      { optional: true }
    ),
    query(':leave', animate('200ms', style({ opacity: 0 })), {
      optional: true,
    }),
  ]),
]);
export const staggerAnimation = trigger('staggerAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger(1000, [animate('0.5s', style({ opacity: 1 }))]),
      ],
      { optional: true }
    ),
  ]),
]);
