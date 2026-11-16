import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZFaq } from './faq';

@Component({
  imports: [ZFaq],
  template: `<z-faq [question]="frage()" [open]="offen()"
    >Nach der Bestellung dauert die Einrichtung in der Regel etwa 60 Sekunden.</z-faq
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FaqHost {
  readonly frage = signal('Wie schnell ist mein Server online?');
  readonly offen = signal(false);
}

@Component({
  imports: [ZFaq],
  template: `<z-faq question="Wie schnell ist mein Server online?" [headingLevel]="stufe()"
    >Etwa 60 Sekunden.</z-faq
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class StufenHost {
  readonly stufe = signal<2 | 3 | 4 | 5 | 6 | undefined>(undefined);
}

@Component({
  imports: [ZFaq],
  template: `<z-faq question="Wie schnell ist mein Server online?" headingLevel="3"
    >Etwa 60 Sekunden.</z-faq
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AttributHost {}

describe('ZFaq', () => {
  function baue(): { details: HTMLDetailsElement; host: FaqHost; rendere: () => void } {
    const fixture = TestBed.createComponent(FaqHost);
    fixture.detectChanges();
    return {
      details: fixture.nativeElement.querySelector('details.z-faq'),
      host: fixture.componentInstance,
      rendere: () => fixture.detectChanges(),
    };
  }

  it('uses a native details with a summary', () => {
    const { details } = baue();

    expect(details.tagName).toBe('DETAILS');
    expect(details.firstElementChild?.tagName).toBe('SUMMARY');
  });

  it('puts the question into the summary', () => {
    const { details, host, rendere } = baue();

    expect(details.querySelector('summary')?.textContent?.trim()).toBe(
      'Wie schnell ist mein Server online?',
    );

    host.frage.set('Kann ich später mehr RAM buchen?');
    rendere();

    expect(details.querySelector('summary')?.textContent?.trim()).toBe(
      'Kann ich später mehr RAM buchen?',
    );
  });

  it('stays closed by default and opens with the open input', () => {
    const { details, host, rendere } = baue();

    expect(details.open).toBe(false);

    host.offen.set(true);
    rendere();

    expect(details.open).toBe(true);

    host.offen.set(false);
    rendere();

    expect(details.open).toBe(false);
  });

  it('shows the projected answer in z-faq__body', () => {
    const { details } = baue();
    const body = details.querySelector('.z-faq__body') as HTMLElement;

    expect(body.tagName).toBe('P');
    expect(body.textContent?.trim()).toBe(
      'Nach der Bestellung dauert die Einrichtung in der Regel etwa 60 Sekunden.',
    );
  });

  it('keeps the summary as bare text without headingLevel, as in 0.2.3', () => {
    const { details } = baue();

    expect(details.querySelector('summary')?.outerHTML).toBe(
      '<summary>Wie schnell ist mein Server online?</summary>',
    );
    expect(details.querySelector('.z-faq__q')).toBeNull();
  });

  it('puts exactly one heading h2 to h6 into the summary and re-renders on a new level', () => {
    const fixture = TestBed.createComponent(StufenHost);
    fixture.detectChanges();
    const details = fixture.nativeElement.querySelector('details.z-faq') as HTMLDetailsElement;

    for (const stufe of [2, 3, 4, 5, 6, undefined, 4] as const) {
      fixture.componentInstance.stufe.set(stufe);
      fixture.detectChanges();
      const summaries = details.querySelectorAll('summary');

      expect(summaries.length).toBe(1);
      expect(details.firstElementChild).toBe(summaries[0]);
      if (stufe === undefined) {
        expect(summaries[0].children.length).toBe(0);
        expect(details.querySelector('.z-faq__q')).toBeNull();
      } else {
        expect(summaries[0].children.length).toBe(1);
        expect(details.querySelectorAll('summary > .z-faq__q').length).toBe(1);
        expect(details.querySelector(`summary > h${stufe}.z-faq__q`)?.textContent).toBe(
          'Wie schnell ist mein Server online?',
        );
      }
    }
  });

  it('takes headingLevel as a static attribute', () => {
    const fixture = TestBed.createComponent(AttributHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('summary > h3.z-faq__q')?.textContent).toBe(
      'Wie schnell ist mein Server online?',
    );
  });

  it('renders no heading for a level outside 2 to 6', () => {
    const fixture = TestBed.createComponent(ZFaq);
    fixture.componentRef.setInput('question', 'Wie schnell ist mein Server online?');

    for (const stufe of [1, 7, '1', '7']) {
      fixture.componentRef.setInput('headingLevel', 3);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('summary > h3.z-faq__q')).not.toBeNull();

      fixture.componentRef.setInput('headingLevel', stufe);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('summary')?.outerHTML).toBe(
        '<summary>Wie schnell ist mein Server online?</summary>',
      );
    }
  });
});
