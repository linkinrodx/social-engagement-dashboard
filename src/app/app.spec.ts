import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SwUpdate } from '@angular/service-worker';
import { App } from './app';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
          {
            provide: BreakpointObserver,
            useValue: {
              observe: () => ({
                pipe: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
                subscribe: () => ({ unsubscribe: () => {} }),
              }),
            },
          },
          {
            provide: SwUpdate,
            useValue: {
              versionUpdates: { subscribe: () => {} },
              checkForUpdate: () => Promise.resolve(),
            },
          },
        ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render toolbar title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.textContent).toContain('Social Engagement Dashboard');
  });
});
