# The PRUBSQ Design System

**Version 1.0 — established with the Insurance Solutions Experience**

This is an internal design handbook, not a component library reference. Its job is to explain *why* the PRUBSQ interface looks and behaves the way it does, so that the next designer or developer who touches this product extends its intent instead of guessing at its surface. If you are about to build a new screen, a new section, or a new "experience" on this site, read this first — not the source code.

---

## 1. Design Philosophy

The Insurance Solutions Experience was not redesigned because the old version looked dated. It was redesigned because it was *organized wrong*. Every principle below exists to keep that mistake from happening again, in any future part of the site.

**Customer-first design.** The interface is built around what a visitor is trying to accomplish, not around what we sell. A page should always be able to answer "what does this person want right now?" before it answers "what do we have to offer?"

**Goals before products.** This is the single most important structural rule in the entire system, and it is not a metaphor — it is enforced in the actual information architecture. A visitor should always encounter a financial goal (Protect My Family, Prepare for Retirement, Grow My Wealth...) before they encounter a product name. Products are the *answer* to a goal, never the entry point. If a future page lets someone arrive at a product without first passing through a goal, that page has broken the philosophy, regardless of how good it looks.

**Guidance before selling.** The site behaves like a financial advisor having a conversation, not a storefront listing inventory. Advisors ask questions, listen, and then recommend. They don't open with a price list. Every page should follow that same sequence: understand, explain, recommend, invite a conversation.

**Trust before conversion.** A conversion (a booked consultation, a completed assessment, a submitted lead) is the *result* of trust, not a thing you can shortcut your way to with a louder button. The design earns the conversion by being calm, honest, and competent first.

**Calm over complexity.** Financial decisions are already stressful. The interface should never add to that stress through visual noise, urgency tactics, or competing calls to action. One clear next step at a time.

**Premium through restraint.** Premium does not mean "more decoration." It means every element present has earned its place, and everything that didn't earn its place was removed. The final polish pass on this experience deliberately *deleted* a decorative badge and a floating ornament that had been added in an earlier pass — both were visually fine, neither was necessary, so both were cut. That instinct — defaulting to removal, not addition — is the core craft discipline of this system.

**Editorial hierarchy.** The page should read like a well-edited magazine spread: a clear lead, supporting detail, and a confident visual rhythm — not like a form or a dashboard where every field carries equal visual weight.

---

## 2. Brand Personality

The PRUBSQ website should feel:

- **Premium** — like working with a senior advisor at a respected institution, not a discount broker.
- **Human** — written and designed by people who understand that insurance decisions are emotional, not purely financial.
- **Calm** — unhurried, confident, never anxious or pushy.
- **Trustworthy** — consistent, accurate, and willing to say "this might not be for you" (see the registry's `notFor` fields on every product — this is a real, existing example of the brand telling the truth even when it costs a sale).
- **Intelligent** — the goal-first architecture, the assessment, and the personalized recommendations all exist to make the visitor feel *understood*, not processed.
- **Professional** — polished without being cold.
- **Modern** — contemporary typography and motion, not a legacy insurance-industry aesthetic.
- **Approachable** — a visitor with zero insurance knowledge should never feel talked down to or locked out.

It should **never** feel like:

- **A dashboard.** Dashboards are for monitoring data. This site is for being guided through a decision. If a page starts to look like rows of stats and panels, stop and ask why.
- **A template.** Generic, interchangeable layouts (a hero, three feature cards, a CTA, repeat) are the opposite of what this system is for. Every section should feel composed for its specific content, not poured into a mold.
- **A corporate brochure.** Brochures talk *at* people. This site should feel like it's listening.
- **An insurance catalog.** No flat grids of products with prices and feature checklists. That framing was deliberately and structurally removed from this experience — it should not creep back in anywhere else.
- **A sales page.** No urgency countdowns, no "Act Now" pressure language, no aggressive red overload. Confidence persuades; pressure repels.

---

## 3. Typography System

The type system has exactly two voices, used for two different jobs. Mixing their roles is the fastest way to undo the editorial feel.

**Fraunces — the editorial voice.** Fraunces is reserved for major headlines only: hero statements and section titles that are meant to be *felt* before they're read in detail — the kind of line a visitor's eye lands on first. It carries the emotional, human register of the brand. It is never used for body copy, card titles, button labels, form fields, or anything functional. The moment Fraunces shows up on a UI element, it stops being a headline voice and starts being decoration — don't let that happen.

**Geist — the functional voice.** Everything else: body copy, card titles, navigation, buttons, labels, forms. Geist is clear, neutral, and gets out of the way. It is the voice of *guidance*, where Fraunces is the voice of *emotion*.

**Heading hierarchy.** There should only ever be one Fraunces-level statement per section — the thing the visitor is meant to read first. Card-level titles (a goal's name, a product's name) live one register down, in bold Geist. This keeps the page from having ten things shouting for attention at once; only the section headline gets the editorial treatment, everything beneath it is calmly functional.

**Body hierarchy.** Body copy uses weight and color, not size, to establish hierarchy against the headline above it — a lighter gray for supporting copy under a black headline, full-weight white for supporting copy under a white headline on a dark surface. Opacity should not be used to create hierarchy in body text; it was tried during this redesign and twice failed accessibility contrast requirements (see Section 12). Weight and color did the job correctly and safely.

**Editorial emphasis — italics.** A single italicized word or short phrase, always in the brand red, is the system's signature emphasis device — "what matters *most*," "what is your *financial goal?*" It exists to land one emotional beat per headline, not to underline general importance. Use it once per headline, on the word that carries the meaning, never as a general styling flourish.

**Tracking rules.** Large display headlines use tight, slightly negative letter-spacing — confident and editorial, the way a magazine masthead sits close together. Small uppercase labels (section eyebrows, the "Recommended for" annotation) use wide, generous letter-spacing — this is what makes small all-caps text read as a deliberate label rather than shouting. Every uppercase label in the system uses the same tracking value; if a new one needs to look slightly different, that's a sign it should be a different kind of element entirely, not a tracking tweak.

---

## 4. Color System

**Primary.** One red. It is the entire accent vocabulary of this brand — there is no secondary accent color, no blue-for-links, no green-for-success. One color, used with intention, reads as confident. Multiple accent colors read as indecisive.

**Neutral palette.** Near-black for primary text, a small range of grays for supporting text and borders, off-white and white for surfaces. The neutral palette does almost all of the work on this site — color is the exception, not the default.

**Red usage philosophy.** Red is for *meaning*, not for *decoration*. It marks: the primary action a visitor should take, the one emphasized word in a headline, the accent that says "this card is annotated/recommended," and section identity (the "Why It Matters" panel is red because that section's entire job is to make an emotional case — the color does real work there, it isn't applied because the section needed visual interest). The explicit instruction during the final polish pass was "do not add more red," and that instinct should hold going forward: before adding a new red element anywhere, ask whether it's marking something meaningful or just filling space.

**Background strategy.** White and a single light neutral gray alternate as section backgrounds to create rhythm without needing borders or dividers between every section. The one saturated exception — full red — is reserved for sections making an emotional, not informational, case. It should remain rare. If more than one section per page goes to full red, the device has lost its power.

**Surface hierarchy.** Cards and floating elements sit on white, always lighter than whatever is behind them, never darker, never another gray. This keeps "what is a clickable surface" unambiguous throughout the page.

**Gradients — when to use them.** Gradients are reserved for two jobs: photography placeholders (standing in for warmth and depth until real photography exists) and the `OrganicBackground` ribbons (where a gradient is what makes a flat SVG shape read as a lit, dimensional surface instead of a sticker). Both are about creating *depth*, specifically.

**Gradients — when not to use them.** Never on text, never on buttons, never on cards, never as a generic "make it look fancier" treatment. A gradient should always be doing the specific job of suggesting a lit surface or photographic warmth — if it isn't doing that job, it's noise.

---

## 5. Layout System

**Container widths.** Every section on a given page should share one container width. The Insurance Solutions Landing Page originally had three different container widths across its sections (carried over from being built section-by-section across several work sessions) — different left/right margins from one section to the next, which is the single most common way a page ends up feeling "assembled" instead of "composed." It was corrected to one width for the entire page. Any new page should pick one container width at the start and hold it for every section.

**Section spacing.** Vertical padding between sections should be generous and should scale up at wider viewports, not stay fixed. A page that feels cramped at desktop because its spacing was tuned for mobile is a common and avoidable mistake.

**Vertical rhythm.** Spacing values throughout a page should belong to a small, deliberate set — not a different arbitrary number every time a developer needed "a bit more room." A page where every gap was chosen on a consistent scale reads as designed; a page where gaps were eyeballed individually reads as implemented.

**Grid philosophy.** Card grids should respond to content count and viewport width predictably (one column on mobile, scaling up), and the gap between grid items should match the gap used in comparable grids elsewhere on the same page. Two visually similar card grids on one page using different gap values is a tell that they were built at different times without cross-checking.

**Whitespace rules.** When in doubt, add more space rather than more content. Whitespace is not empty — it's what allows the few elements that *are* present to feel important. The instruction that produced this redesign's most universally positive feedback was simply "increase whitespace."

**Responsive behavior.** Don't assume a desktop-tuned visual effect survives being resized for mobile. The `OrganicBackground` hero ribbon is the concrete example: its curve is intentionally drawn for a wide aspect ratio, and rather than force that same shape into a narrow mobile container (where it visibly distorted), the mobile experience uses a simpler, calmer treatment of the same content. Adapting an effect for a smaller viewport is not a compromise — sometimes the more restrained mobile version is the better design on its own terms.

---

## 6. Organic Background System

**Why it exists.** Flat, hard-edged section dividers (a straight horizontal line where white meets a color block) are the visual signature of a templated site. The organic, flowing curve is what gives PRUBSQ's pages a sense of being *crafted spaces* rather than stacked rectangles. It is the single most distinctive visual device in this system — protect it from overuse.

**When it should be used.** Sparingly, and only at points that genuinely need it: the hero, where it frames the one piece of photography on the page, and at the transition into a saturated-color section, where it replaces what would otherwise be a hard seam. It should not appear on every section of a page. If it shows up more than twice on one page, it has stopped being a signature device and started being wallpaper.

**How curves guide composition, not decorate it.** The shape is never placed in front of content or behind it as a backdrop pattern — it is structural. In the hero, it defines *where the photo lives*; the photo is "inside" the curve, not floating in front of a curve that's behind it for atmosphere. In a section transition, the wave *is* the seam between two sections, not a stripe added on top of an already-finished seam. If a curve could be deleted without changing where anything else sits, it's decoration and doesn't belong in this system.

**Layered, not flat.** A single flat-color shape reads as a sticker. The system's curves are built from two layered surfaces — a primary gradient-filled shape and a second, lower-opacity surface offset behind it — so the shape reads as something with physical depth, sitting at two distances from the viewer, the same way a piece of paper has a shadow under it.

**Usage example, in plain terms:** the hero's curve sweeps in from the top edge and swells around where the photo sits, so the photo visually feels "held" rather than "placed on top of a background." The panel-transition wave does the equivalent job at a section seam: it's the soft edge where one section hands off to the next, replacing what would otherwise be an abrupt color change.

---

## 7. Card System

There are two card families on this site, and the distinction between them matters more than their visual similarity suggests.

**Goal Card.** Purpose: invite a choice. This is the card a visitor clicks when they're still deciding what they need. Because it represents an *active decision point*, its strongest visual cue (a top accent rule) only appears on hover — it activates in response to attention, the way a real decision point should. Elevation is light at rest and lifts noticeably on hover, reinforcing "this is interactive, come closer."

**Recommendation Card.** Purpose: present something already decided. By the time a visitor sees this card, they've already chosen a goal — this card is the advisor's answer, not a new question. Its accent (a permanent left rule, not a hover-revealed top rule) is therefore always present, like a note already written in the margin, not something waiting to be triggered. It deliberately carries no label that says "recommended" — the recommendation is communicated by where the card sits (beneath a goal heading) and how it's framed (the permanent accent), not by a badge insisting on it. This was a specific, deliberate choice made in the final polish pass: a textual badge was tried and removed because hierarchy and composition did the same job without needing to say it out loud.

**Quote Card.** Purpose: a single, human, credible voice — not a marketing claim. It is given more visual weight than either card type above (a larger radius, a more generous shadow, more interior padding) because it is meant to feel like the page is pausing to let a real person speak, not listing another piece of content.

**Trust Card (the icon trust strip items).** Purpose: a closing reassurance, not a feature list. These are the lightest-weight elements in the card system on purpose — no border, no shadow, no hover state. They are read once, at the end of a page, as a calm confirmation, not interacted with.

**Premium Surface (the floating CTA bar, the appointment form container).** Purpose: a moment where the page asks for something — attention, a decision to talk to someone. These get the most elevation in the system, because they are the closest thing to a "raise your hand" moment in an otherwise calm page.

**Shared behavior across all interactive cards:** elevation increases and the card lifts very slightly on hover, never more. No color shifts on the card body itself, no scale-jumps, no border flashes. The interaction should feel like the surface is acknowledging attention, not performing for it.

---

## 8. Radius Scale

Three values, and only three. A future contributor introducing a fourth radius value should be able to explain which of these three tiers it belongs to — if it doesn't belong to any of them, it's probably wrong, not a legitimate new tier.

- **14px — chips.** Small, self-contained icon containers (the soft circular/rounded backgrounds behind goal icons, trust-strip icons). Always paired with a soft gradient fill, never a flat color, never a border.
- **20px — content cards.** Goal cards, recommendation cards — the cards a visitor reads and clicks through the body of a page.
- **24px — large surfaces.** Anything large enough to function as its own "room" within the page: the hero photo treatment, the featured quote card, the floating CTA bar.

This scale was not always consistent — an earlier pass had recommendation cards at 16px against goal cards' 20px, and the CTA bar at a one-off 28px. Both were corrected during the final polish pass specifically because two visually paired elements with different roundedness reads as an oversight, not a choice.

---

## 9. Elevation System

**Surface layers.** Every floating element on this site sits on exactly one of a small number of elevation levels — flat (text and content with no surface), resting card (the default state of any card), and lifted (a card on hover, or a permanently prominent surface like the floating CTA bar). There is no "very elevated" tier above that; nothing on this site should look like it's hovering far off the page.

**Shadow philosophy — why this system avoids heavy shadows.** A single large, soft, dark blur under an element reads as "a card with a shadow plugin applied," which is the visual signature of an unpolished interface. This system instead uses a two-part shadow on every elevated surface: a very tight, very subtle "contact" shadow immediately under the element (as if it's resting directly on the surface beneath it) plus a softer, more diffused "ambient" shadow further out (as if light is falling on the whole scene). Together they read as a real object sitting on a real surface, rather than a flat rectangle with a stylistic effect bolted on. The first version of this redesign used single heavy shadows; the craftsmanship pass replaced every one of them with this two-part technique.

**Layered surfaces over stronger shadows.** Where extra depth is needed — the hero photo, the quote card — the system prefers adding a second, physical surface offset slightly behind the first (visible as a sliver at one edge) rather than simply making the shadow bigger and darker. A second surface reads as architecture; a bigger shadow just reads as a bigger shadow.

**Ambient depth.** Large color-block sections (the red "Why It Matters" panel) use very soft, off-center radial light washes rather than sitting as one completely flat color. This is what separates a section that feels *lit* from one that feels like a poster-color rectangle. The effect should be felt, not consciously noticed — if a visitor can point at the glow, it's too strong.

**Hover behavior.** A consistent, small upward shift (a few pixels) plus a deepening of the two-part shadow is the system's one hover signature for cards. It is used identically across every card family so that "this is interactive" is communicated the same way everywhere on the site.

---

## 10. Motion System

**One shared easing curve.** Every transition and animation on this site — button hovers, card lifts, scroll-triggered reveals — uses the same gentle "ease-out" curve: motion starts promptly and settles softly, without ever bouncing or overshooting its target. This single choice is what makes the whole page feel like one coherent system rather than a collection of elements each animated by whoever built them that day. A future addition that introduces a different easing curve will feel subtly "off" even if no visitor could say exactly why.

**Transition durations.** Hover feedback is fast (a fraction of a second) because it's responding to something the visitor is doing right now. Scroll-triggered reveals are slower and more deliberate, because they're setting a mood for content the visitor hasn't read yet. Faster motion belongs to direct interaction; slower motion belongs to arrival.

**Hover motion.** Small and consistent: a slight lift, a deepening shadow, an icon nudging a few pixels in the direction implied by an arrow. Motion on hover should always be small enough that it reads as acknowledgment, not performance.

**Scroll animation philosophy.** Content fades and rises gently into place as a visitor scrolls to it — once, never repeating, never distracting on a second pass back up the page. Related items (a row of cards, a checklist) stagger in with a brief, consistent delay between each, which reinforces that they belong together as a set rather than appearing as one undifferentiated block.

**The governing principle: motion reinforces hierarchy, it never becomes decoration.** Every piece of motion in this system exists to answer a real question — "did my hover register," "what's arriving on screen now," "which of these items belongs to the same group." The explicit instruction during the final polish pass was "do not add more animation," and the right response to that instruction is never to remove motion that's doing one of those jobs — only to refuse motion that exists for its own sake.

---

## 11. Iconography

**Sizes.** Two sizes cover the entire system. Icons housed inside a chip (see Section 8) are sized to roughly 40% of their container — large enough to read clearly, small enough that the chip itself remains the dominant shape. Icons sitting inline with text — inside a button, next to a link — are smaller and sized to feel like punctuation to the text beside them, not a competing graphic element.

**Containers.** An icon that represents a concept (a goal, a trust statement) sits inside a soft chip. An icon that's reinforcing an action (an arrow after "Learn More," a message icon before "Chat") sits inline, with no container at all. Mixing these up — putting a chip around an inline action icon, or floating a concept icon with no container — breaks the visual grammar a visitor has already learned from the rest of the page.

**Spacing.** Icon-to-text gaps are small and consistent; the icon should read as part of the same unit as its label, not as a separate element that happens to be nearby.

**Accent treatment.** Icons are drawn with a slightly lighter stroke weight than the system's default — finer lines feel more editorial and less like default UI iconography. Color follows the same red-for-meaning rule as everything else: an icon is red when it's marking something significant, and a neutral gray or white otherwise.

**Consistency rule.** Two icons performing the same job anywhere on the same page must be sized and styled identically. This sounds obvious and was nonetheless violated three separate times during this redesign (chip icons ranging from 19–21px depending on which component they were in) before being corrected in the final pass. Check this explicitly before shipping anything new.

---

## 12. Accessibility

**Contrast requirements.** Every text color choice must be checked against its actual background — computed, not eyeballed — before shipping. "It looks readable" is not a standard; 4.5:1 contrast for normal-size text and 3:1 for large text (per WCAG AA) is the standard, with no exceptions for decorative-feeling text.

**Typography contrast — examples from this redesign, kept here deliberately as a warning.** During the craftsmanship pass, white text at reduced opacity was used on the red panel to create a softer secondary-text feel beneath a bold white headline. It looked reasonable. It measured 3.54:1 — a real failure, not a borderline judgment call. The fix was not to nudge the opacity slightly (a near-miss value was tested and still fell short at 4.48:1) but to commit to full-opacity text and create the intended visual hierarchy through font weight instead. The same failure pattern showed up independently in a small uppercase label elsewhere on the same panel (3.85:1) and was fixed the same way. The lesson: opacity is not a safe tool for creating text hierarchy on a colored background. Weight and size are.

**Interactive sizing.** Buttons and clickable cards should always offer a comfortably large touch target, especially on mobile — generous internal padding is a usability requirement here, not just a spacing preference.

**Focus behavior.** Every interactive element must remain genuinely operable by keyboard, with a visible focus state. Hover-only feedback is not a substitute for focus feedback.

**Color accessibility.** The system's reliance on a single accent color is itself an accessibility strength — it means meaning is never communicated by color alone without an accompanying label, icon, or position cue, which keeps the interface legible for visitors with color vision differences.

**Reduced-motion expectations.** Motion in this system is supportive, not load-bearing — no content should ever be inaccessible or unreadable if animations are reduced or disabled. As the system matures, scroll-triggered reveals and hover transitions should respect a visitor's reduced-motion preference rather than overriding it.

---

## 13. Components

These are the reusable visual primitives this redesign introduced. They live outside the Insurance Solutions code specifically so future experiences can use them without rebuilding them.

**OrganicBackground.** The curve/wave system described in Section 6. Use it to frame a hero's primary image or to soften the seam into a saturated-color section. Do not reach for it as a generic "make this section more interesting" device.

**SectionEyebrow.** The small label-and-rule mark that introduces every major section ("Insurance Solutions," "Why It Matters," "Start Here"). It exists so that every section across the entire site announces itself the same way — same size, same tracking, same rule treatment — rather than each page inventing its own version of "a little label above the headline."

**FeaturedQuoteCard.** The large editorial quote treatment described in Section 7. Reuse it anywhere the site wants to pause and let a real, named person speak with credibility — a client testimonial, a future team-member spotlight, an advisor's perspective. It is built to gracefully fall back to an initials avatar when a photo isn't yet available, so it never blocks on missing assets.

**IconTrustStrip.** The closing reassurance row described in Section 7. Reuse it as the calm, confidence-building closer on any page that ends with an ask (a consultation, an application, a sign-up) — it is the visual equivalent of a final reassuring nod before someone commits.

**Premium Buttons.** The pill-shaped primary/secondary button pair used throughout the hero and CTA moments — solid red for the single most important action on a page, outlined red for the next-best alternative. Never more than one solid-red button visible in the same view; that's what keeps it meaning "the one thing to do here."

**Hero Media (the layered photo treatment).** The pattern of presenting a hero's primary image as a surface with depth — an undertone layer, a soft shadow, and (at wide viewports) the organic curve wrap — rather than a plain rectangular photo. This is the template for how any future experience should present its own hero photography once real imagery exists.

---

## 14. Design Principles

A short list to hold yourself to before shipping anything in this system:

- **Reuse before creating.** If something close to what you need already exists in this system, extend it. A new one-off component is a future inconsistency waiting to happen.
- **Preserve rhythm.** Before adding a new spacing value, font size, radius, or shadow, check whether an existing one already does the job. It almost always does.
- **Remove unnecessary decoration.** When you're not sure whether an element earns its place, the answer is to remove it and see if anything is actually lost.
- **Composition before ornament.** Solve a design problem by arranging existing elements differently before reaching for a new visual effect.
- **Hierarchy before styling.** Decide what matters most on a page first; let that decision determine size, weight, and color — don't style elements individually and hope a hierarchy emerges.
- **Goals before products.** The architectural rule from Section 1, restated as a design rule: never let a visitor reach a product without first passing through a goal.
- **Consistency over novelty.** A new idea that doesn't agree with the rest of the system is not a creative contribution, it's debt. Novelty is welcome at the system level (a new pattern everyone then adopts), not at the individual-page level (one page quietly doing its own thing).

---

## 15. Future Experiences

This system was built once, on the Insurance Solutions Experience, but it was deliberately built to generalize. Every future PRUBSQ experience — Business Solutions, Health & Protection, a Learning Center, the Financial Assessment, Recruitment, a future Client Portal — should be recognizably part of the *same* product, not a sibling site that happens to share a logo.

In practice, that means:

- Each new experience should follow the same underlying shape established here — a **customer goal or need**, surfaced first; **education** about why it matters; a **personalized recommendation**; and a **clear invitation to a conversation** — adapted to its own domain. Recruitment's "goal" might be "which role fits me," Health & Protection's might be "what coverage gap am I exposed to" — the shape repeats, the content doesn't.
- Each new experience should reuse the typography system, color system, radius scale, elevation system, motion system, and the components listed in Section 13 as-is. None of those should be reinvented per experience.
- Each new experience may introduce its *own* registry of goals/needs and recommendations (the way `lib/products.ts` belongs to Insurance Solutions specifically), but it should not introduce its own visual language to go with it.
- If a future experience seems to need a new visual primitive that doesn't fit anything in Section 13, that's a legitimate moment to extend this document — but the new primitive should be built to the same restraint standard as everything else here, and this document should be updated to explain *why* it exists, not just what it does.

The measure of success for this design system is not that every page looks identical — it's that a visitor moving from the Insurance Solutions Experience into any future experience never has the feeling of having left the same trusted advisor mid-conversation.
