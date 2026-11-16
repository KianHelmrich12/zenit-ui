import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * One question of the FAQ. The answer is the projected content.
 *
 * Renders a native `<details class="z-faq">` with the question in the
 * `<summary>` and the answer in `<p class="z-faq__body">`. Because it is the
 * native element, opening and closing work without JavaScript, the disclosure
 * is reachable by keyboard and announced with its expanded state; the component
 * adds no keyboard handling of its own. With {@link headingLevel} the question
 * inside the `<summary>` becomes a heading `h2` to `h6` with the class
 * `z-faq__q`, so the questions join the heading outline of the page.
 *
 * Put several of them under one another, the first one open. Answers run two to
 * three sentences with concrete numbers.
 *
 * @example
 * ```html
 * <h2>Häufige Fragen</h2>
 * <z-faq question="Wie schnell ist mein Server online?" headingLevel="3" open>
 *   Nach der Bestellung dauert die Einrichtung in der Regel etwa 60 Sekunden.
 * </z-faq>
 * <z-faq question="Kann ich später mehr RAM buchen?" headingLevel="3">
 *   Ja, im Panel unter Upgrade. Der neue Preis gilt ab der nächsten Stunde.
 * </z-faq>
 * ```
 */
@Component({
  selector: 'z-faq',
  template: `<details class="z-faq" [open]="open()">
    @switch (headingLevel()) {
      @case (2) {
        <summary>
          <h2 class="z-faq__q">{{ question() }}</h2>
        </summary>
      }
      @case (3) {
        <summary>
          <h3 class="z-faq__q">{{ question() }}</h3>
        </summary>
      }
      @case (4) {
        <summary>
          <h4 class="z-faq__q">{{ question() }}</h4>
        </summary>
      }
      @case (5) {
        <summary>
          <h5 class="z-faq__q">{{ question() }}</h5>
        </summary>
      }
      @case (6) {
        <summary>
          <h6 class="z-faq__q">{{ question() }}</h6>
        </summary>
      }
      @default {
        <summary>{{ question() }}</summary>
      }
    }
    <p class="z-faq__body"><ng-content /></p>
  </details>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZFaq {
  /**
   * The question, shown in the `<summary>`. A real question from support, not a
   * headline.
   *
   * @default ''
   */
  readonly question = input('');

  /**
   * Whether the answer starts out visible; the spec asks for the first question
   * to be open. Written as a bare attribute (`open`) it counts as `true`. It is
   * a one-way binding on the native `open` property, so the visitor can toggle
   * freely afterwards and a new value from the caller wins again.
   *
   * @default false
   */
  readonly open = input(false, { transform: booleanAttribute });

  /**
   * Makes the question a heading: `2` to `6` for `h2` to `h6`, inside the
   * `<summary>`. Pick the level below the heading of the FAQ section, usually
   * `3` under an `h2`. Unset, the `<summary>` holds the bare text as before;
   * any other value is treated the same. The question keeps the look of the bare
   * text against heading rules of the application without `!important`; a rule
   * with `!important` still wins.
   *
   * @default undefined
   */
  readonly headingLevel = input<
    2 | 3 | 4 | 5 | 6 | undefined,
    2 | 3 | 4 | 5 | 6 | '2' | '3' | '4' | '5' | '6' | undefined
  >(undefined, {
    transform: (wert) => (wert === undefined ? undefined : (Number(wert) as 2 | 3 | 4 | 5 | 6)),
  });
}
