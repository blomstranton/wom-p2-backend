## Projekt 1 - Stugmäklaren

_Anton Blomström_

### Webbtjänster och molnteknologi 21

**Del 1 – Grundläggande REST-API**
Jag tycker denhär delen gick bra, jag tycker jag har använt "best practises" ganska bra.
Ända man kan göra om man inte är inloggad är att lägga till en användare och logga in, för allt annat behöver man vara inloggad.
Logiken i PUT cabins och bookings är jag lite osäker på om den är gjort på bra sätt, men det fungerar så att man måste ha med alla fält för att kunna göra en ändring.
PATCH, PUT & DELETE finns inte för users  
**Del 2 – Lösenord, inloggning och JWT**
Login sker på /users/login
Jag använde bcrypt för att hasha lösenord och bcrypts inbydda salt function för att salta lösenorden.
JWT_SECRET finns i .env filen
JWT har en giltighetstid på 1h  
**Del 3 – Begränsade rättigheter**
Användare måste ha en giltig jwt för att kunna göra POST, PATCH,PUT eller DELETE, och användare kan bara göra dessa på sina egna resurser.  
**Del 4 – Stil och logik**
Några kommentarar har jag där man kanske måste klargöra vad koden gör eller vad den inte gör. Annars tycker jag att koden är helt läsbar.
Finns en del res.status()... som man kanske skulle kunna snygga till lite men det blev inte av.  
**Del 5 - Node-miljö och Testfiler**
När jag arbetade och testat så har jag använt mig av [Insomnia](https://insomnia.rest/) för jag har använt det för och tycker det fungerar bra.
Tycker att när man använder REST client i vscode så blir .http filerna ganska svårlästa.
Det var nu först i slutet satte jag till .http filerna och testade dem så att de fungerade med REST client.
