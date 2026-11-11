# Apartment 2 installation plan

The apartment is a furnished home, not a display wall for every catalogue item. The physical fittings are defined in `FITTINGS`; catalogue alternatives replace a fitting and never create another one.

| Room | Lighting circuit | Single fitted control | Other planned equipment |
| --- | --- | --- | --- |
| Living | Light 1 | Touch Panel (magnetic or screen alternative) | One ceiling light and fan, TV plug, AC remote, one window motor, console drawer lock, one visitor monitor, hall doorbell, one motion sensor, utility meter |
| Kitchen | Light 2 | Edge Panel (retrofit alternative) | One ceiling light, gas sensor, smoke detector |
| Bedroom | Light 3 | Bezzel Panel (premium glass alternative) | One ceiling light and fan, presence sensor, one lock on the existing wooden door |
| Bedroom 2 | Light 4 | K Panel | Existing room lighting and one ceiling fan |
| Bathroom | Light 5 | Modular Switch | One tube light with simulated backup |

Rules:

- Each room has one lighting circuit and exactly one active main light control. The switch, dimmer, app and light fixture all address that same circuit.
- A room action affects only its own circuit. Home/Evening/Away and explicit “all lights” commands are the only whole-home operations.
- Fans belong only to the three rooms with a planned ceiling fan. Replacing a finish preserves the speed and adds no power load.
- Sensor events belong to their room. Smoke and gas events raise alerts without switching unrelated lighting.
- IP and analog monitors are alternatives at one monitor fitting; a doorbell call is shared with the fitted monitor.
- Wooden, lever and screen locks are alternatives on the existing bedroom door. Glass and sliding locks remain in the product catalogue because there is no compatible planned door. Do not add a fictitious door to demonstrate them.
- Placement follows a cross-section of the imported apartment mesh. The bedroom 2 control faces inward from its own side of the partition. The built-in lights are tinted by room in world space, including where a baked mesh spans several rooms.
- Tour order: living overview → lights → TV → AC → window → kitchen lights and safety → bedroom lights and fan → bedroom 2 lights and fan → bathroom lights and backup. Each room also exposes its fitted devices directly.
- Energy counts five physical lighting circuits and three fitted fans, once each. Catalogue alternatives never add duplicate usage.
- Keep the simulation at viewport height, the header at the page top, and the footer after the scroll story. Camera movement stays at eye height and uses the existing wall checks.

Regression checks enforce one active controller per room, compatible substitution, room-only actions, linked visitor calls, isolated sensors, load accounting and contiguous room tour order.
