# $ conduit_coffee -> coffee/for/the_people

A proof-of-concept website to showcase Conduit BTC's developments for Nostr
Lightning E-Commerce

## Project Structure

A monorepo with two applications

- frontend/ - A React/Vite app
- service/ - An ExpressJS app

### Integrations

- Shipping Provider: ShipStation
- Lightning Payment Service Provider: Strike (previously BTCPay Server; see
  previous commits; we will bring back the BTCPay Server integration in a future
  dev cycle)
- Nostr - Our receipt system includes a "Publish Receipt to Relay as DM" feature

## Future Scope

Today, this repo is a wonderful webwork of execution steps in desparate desire
for a refactor. In the pursuit of feature development on a short timescale,
several implementation patterns were implemented without best-case refactoring.
There's some spaghetti; mind the dust.

Our intention with conduit.coffee is to scrap the service/ and replace it with
[C3: The Conduit Commerce Coordinator](https://github.com/Conduit-BTC/conduit-commerce-coordinator).
While C3 is in-development, this website will likely remain as-is with
occasional bug-fixes on an as-reported basis. Once the C3 integration is
underway, we'll refactor the frontend for best-case as well.
