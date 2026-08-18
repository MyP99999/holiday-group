export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_META = {
  en: { label: "English", short: "EN", locale: "en-GB" },
  ro: { label: "Română", short: "RO", locale: "ro-RO" },
  es: { label: "Español", short: "ES", locale: "es-ES" },
  fr: { label: "Français", short: "FR", locale: "fr-FR" },
  de: { label: "Deutsch", short: "DE", locale: "de-DE" },
};

const en = {
  overview: "Overview", expenses: "Expenses", scan_receipt: "Scan receipt", scan: "Scan",
  restaurant_split: "Restaurant split", split: "Split", settle_up: "Settle up", settle: "Settle",
  trip_logistics: "Trip logistics", plan: "Plan", group_chat: "Group chat", chat: "Chat",
  current_trip: "Current trip", untitled_trip: "Untitled trip", guest_room: "Guest room",
  shared_room: "Shared room", copy_invite: "Copy invite", invite_copied: "Invite copied",
  saved_device: "Saved on this device", all_trips: "All trips", leave_trip: "Leave trip",
  back_home: "Back home", cancel: "Cancel", remove: "Remove", add: "Add", save: "Save",
  name: "Name", nickname: "Nickname", currency: "Currency", amount: "Amount", total: "Total",
  people: "People", person: "person", select_all: "Select all", unassigned: "Unassigned",
  admin: "Admin", member: "Member", you: "You", make_admin: "Make admin", remove_admin: "Remove admin",
  creator_admin_note: "The room creator starts as admin and can promote other members.",
  role_help: "Admins can manage members and grant access. Expenses remain visible to everyone.",
  trip_overview: "Trip overview", overview_desc: "The people, balances and currencies behind this trip.",
  add_expense: "Add expense", total_spent: "Total spent", per_person: "Per person", rates_updated: "Rates updated", live_rates: "Live ECB rates", refresh_rates: "Refresh rates", updating_rates: "Updatingâ€¦",
  add_everyone: "Add everyone who may pay or contribute.", add_person: "Add person",
  start_group: "Start with the group", start_group_desc: "Add at least two people, then record a shared cost.",
  currency_desk: "Currency desk", currency_desc: "ECB reference values per €1.", use_rates: "Use these rates in an expense",
  gets: "gets", owes: "owes", settled: "settled",
  expenses_desc: "Every shared cost, in one place.", recent_expenses: "Recent expenses", add_an_expense: "Add an expense",
  description: "Description", what_for: "What was this for?", paid_by: "Paid by", split_equally: "Split equally",
  custom_amounts: "Custom amounts", split_between: "Split between", save_expense: "Save expense",
  add_people_first: "Add people first", group_needs_names: "The group needs names before a cost can be shared.",
  no_expenses: "No expenses yet", no_expenses_desc: "Use the form, scan a receipt, or start a restaurant split.",
  scan_title: "Scan a receipt", scan_desc: "Take a photo. Check the items. Choose who shared each one.",
  add_group_first: "Add the group first", receipt_people_desc: "Receipt items need contributors before they can be saved.",
  photograph_upload: "Photograph or upload", reading_receipt: "Reading your receipt…",
  scan_prototype_note: "On mobile, the first option opens the camera. Receipt reading is simulated locally until OCR is connected.",
  take_photo: "Take photo", choose_library: "Choose from library", sample_receipt: "Use sample receipt",
  tap_initials: "Tap initials to change who shared an item.", add_items_trip: "Add {count} items to trip",
  restaurant_desc: "Assign dishes, share the table costs, settle once.", restaurant: "Restaurant",
  item: "Item", shared_with: "Shared with", add_item: "Add another item", tip: "Tip", tax: "Tax",
  table_total: "Table total", save_restaurant: "Save restaurant split", restaurant_people_desc: "A restaurant split needs at least one guest.",
  settle_desc: "Use the fewest payments, or route one through another member when a direct payment is not possible.",
  group_balances: "Group balances", balance_help: "Positive balances receive money.", payments_to_make: "Payments to make",
  route_help: "Choose a different route without changing anyone's final balance.", no_balances: "No balances yet",
  no_balances_desc: "Add people and expenses to calculate who owes what.", gets_back: "gets back",
  everything_even: "Everything is even.", no_payments: "No payments are needed.", add_first_expense: "Add the first expense when you are ready.",
  pays: "pays", cant_pay_direct: "Can't pay directly?", pay_directly: "Pay directly", pay_via: "Pay via {name}",
  route_steps: "Two-step payment route", first_pay: "First, {from} pays {via}", then_pay: "Then, {via} pays {to}",
  no_route_people: "Add a third member to use an alternative route.",
  logistics_desc: "Rooms, rides and the small details everyone needs.", add_accommodation: "Add accommodation", add_stay: "Add stay",
  stays_rooms: "Stays & rooms", stays_help: "Add every property, then place people in rooms and split each room fairly.",
  no_stays: "No stays yet", no_stays_desc: "Add the first accommodation and start assigning rooms.",
  stay_name: "Accommodation name", location: "Location", nights: "Nights", create_stay: "Create stay",
  add_room: "Add room", room: "Room", capacity: "Capacity", assigned: "Assigned", room_total: "Room total",
  room_split: "{amount} per guest in this room", room_empty: "Assign guests to calculate the room split.",
  comments: "Comments", add_comment: "Add a comment", comment_placeholder: "Share a note with the group…",
  cars_seats: "Cars & seats", cars_help: "Set a driver, seat count, and exactly who rides in each car.", add_car: "Add car",
  no_cars: "No cars yet", no_cars_desc: "Add a car to coordinate drivers and available seats.", car_name: "Car name",
  seats: "Seats", driver: "Driver", choose_driver: "Choose driver", passengers: "Passengers",
  seat_open: "1 seat open", seats_open: "{count} seats open", car_full: "Car full", create_car: "Create car",
  accommodation_total: "Accommodation total", logistics_saved: "Every change is saved to this trip automatically.",
  stay_price: "Total stay price", split_method: "Split method", split_by_people: "Equal by guests", split_by_rooms: "Equal by occupied rooms",
  who_stayed: "Who stayed here", who_stayed_help: "Select everyone included in this accommodation.", room_share: "Room share", included_guest_split: "Included in guest split",
  split_preview: "Split preview", select_participants_first: "Select participants to calculate the split.", car_rental_total: "Car rentals total",
  rental_car: "Rental car", rental_help: "Track the rental separately from seats and driving.", rental_enabled: "Rental enabled", not_rental: "Not a rental",
  rental_price: "Total rental price", per_participant: "per participant", rental_participants: "Who shares this rental", rental_participants_help: "Choose who contributes to the rental cost.", rental_split: "Rental split",
  planned_split: "Planned cost split", planned_split_desc: "Accommodation and car rental shares in the selected currency.", stays: "Stays", rentals: "Rentals",
  flights: "Flights", flights_help: "Add each flight, itinerary, fare and exactly who is travelling.", flight_total: "Flight total", add_flight: "Add flight", no_flights: "No flights yet", no_flights_desc: "Add a flight to coordinate travel and split ticket costs.", flight: "Flight", from_airport: "From airport", to_airport: "To airport", airline: "Airline", flight_number: "Flight number", departure: "Departure", arrival: "Arrival", total_fare: "Total fare", create_flight: "Create flight", who_is_flying: "Who is flying", flight_participants_help: "Choose everyone included in this fare.", flight_split: "Flight split",
  chat_desc: "A simple room for decisions, reminders and arrival details.", no_messages: "No messages yet",
  no_messages_desc: "Start the conversation with the first trip update.", type_message: "Type a message…", send: "Send",
  visible_all: "Visible to all trip members", sending_as: "Sending as",
  share_room_title: "Share a room. Skip the account.", guest_intro: "Use a room code, choose your existing name, or join with a new nickname. No account required.",
  no_signup: "No sign-up", guest_storage: "Guest rooms are stored in this browser during the prototype stage.",
  create_guest_room: "Create a guest room", trip_name: "Trip name", create_room: "Create room", or_join: "or join one",
  room_code: "Room code", join: "Join", nickname_required: "Add a nickname before continuing.", room_not_found: "We could not find that room in this browser yet.",
  nickname_hint: "This is how the group will see you.",
  how_it_works: "How it works", for_groups: "For groups", sign_in: "Sign in",
  hero_title: "Trips are better when money feels simple.",
  hero_desc: "Track every shared cost, scan the receipt at dinner, and settle the group fairly—across currencies and without awkward maths.",
  start_local_trip: "Start a local trip", open_guest_room: "Open a guest room",
  no_account_choice: "No account needed. Choose local-only or a shareable guest room.",
  join_guest_room: "Join a guest room", find_room: "Find room", room_found: "Room found", already_listed: "Are you already in this trip?",
  claim_existing_help: "Choose your existing name so your costs and assignments stay connected.", choose_existing_person: "Choose your name before joining.",
  person_already_claimed: "That person has already joined. Choose another name or use a new nickname.", join_as: "Join as {name}", choose_your_name: "Choose your name",
  or_new_nickname: "or join as someone new", no_names_available: "Everyone already listed has joined. Use a new nickname below.",
  new_nickname: "New nickname", new_nickname_hint: "Use this only if you are not already listed.", join_as_new: "Join as a new person",
  pending: "Pending", history: "History", mark_as_paid: "Mark as paid", paid: "paid", paid_on: "Paid {date}", paid_via: "via {name}",
  confirm_payment: "Confirm payment", confirm_payment_desc: "This updates the balances and moves the payment to History.", confirm_paid: "Confirm as paid",
  no_payment_history: "No payment history yet", no_payment_history_desc: "Confirmed payments will appear here.",
};

const ro = {
  overview:"Prezentare", expenses:"Cheltuieli", scan_receipt:"Scanează bonul", scan:"Scanare", restaurant_split:"Împărțire restaurant", split:"Împărțire", settle_up:"Decontare", settle:"Decontare", trip_logistics:"Logistica excursiei", plan:"Plan", group_chat:"Chat de grup", chat:"Chat",
  current_trip:"Excursia curentă", untitled_trip:"Excursie fără nume", guest_room:"Cameră de oaspeți", shared_room:"Cameră partajată", copy_invite:"Copiază invitația", invite_copied:"Invitație copiată", saved_device:"Salvat pe acest dispozitiv", all_trips:"Toate excursiile", leave_trip:"Părăsește excursia", back_home:"Înapoi acasă", cancel:"Anulează", remove:"Șterge", add:"Adaugă", save:"Salvează", name:"Nume", nickname:"Poreclă", currency:"Monedă", amount:"Sumă", total:"Total", people:"Persoane", person:"persoană", select_all:"Selectează tot", unassigned:"Nealocat",
  admin:"Administrator", member:"Membru", you:"Tu", make_admin:"Fă administrator", remove_admin:"Retrage rolul", creator_admin_note:"Creatorul camerei este administrator și poate promova alți membri.", role_help:"Administratorii gestionează membrii și rolurile. Cheltuielile sunt vizibile tuturor.",
  trip_overview:"Prezentarea excursiei", overview_desc:"Persoanele, soldurile și monedele acestei excursii.", add_expense:"Adaugă cheltuială", total_spent:"Total cheltuit", per_person:"Per persoană", rates_updated:"Curs actualizat", live_rates:"Cursuri BCE live", refresh_rates:"Actualizează cursurile", updating_rates:"Se actualizeazăâ€¦", add_everyone:"Adaugă toate persoanele care pot plăti sau contribui.", add_person:"Adaugă persoană", start_group:"Începe cu grupul", start_group_desc:"Adaugă cel puțin două persoane, apoi o cheltuială comună.", currency_desk:"Curs valutar", currency_desc:"Valori de referință BCE pentru 1 €.", use_rates:"Folosește cursurile într-o cheltuială", gets:"primește", owes:"datorează", settled:"achitat",
  expenses_desc:"Toate costurile comune, într-un singur loc.", recent_expenses:"Cheltuieli recente", add_an_expense:"Adaugă o cheltuială", description:"Descriere", what_for:"Pentru ce a fost?", paid_by:"Plătit de", split_equally:"Împarte egal", custom_amounts:"Sume personalizate", split_between:"Împarte între", save_expense:"Salvează cheltuiala", add_people_first:"Adaugă mai întâi persoane", group_needs_names:"Grupul are nevoie de nume înainte de împărțirea unui cost.", no_expenses:"Nu există cheltuieli", no_expenses_desc:"Folosește formularul, scanează un bon sau începe o împărțire de restaurant.",
  scan_title:"Scanează un bon", scan_desc:"Fotografiază. Verifică articolele. Alege cine a participat.", add_group_first:"Adaugă mai întâi grupul", receipt_people_desc:"Articolele de pe bon au nevoie de participanți.", photograph_upload:"Fotografiază sau încarcă", reading_receipt:"Citim bonul…", scan_prototype_note:"Pe mobil, prima opțiune deschide camera. Citirea este simulată local până conectăm OCR.", take_photo:"Fă o fotografie", choose_library:"Alege din galerie", sample_receipt:"Folosește bonul exemplu", tap_initials:"Atinge inițialele pentru a schimba participanții.", add_items_trip:"Adaugă {count} articole în excursie",
  restaurant_desc:"Alocă preparatele, împarte costurile mesei și decontează o singură dată.", restaurant:"Restaurant", item:"Articol", shared_with:"Împărțit cu", add_item:"Adaugă alt articol", tip:"Bacșiș", tax:"Taxă", table_total:"Total masă", save_restaurant:"Salvează împărțirea", restaurant_people_desc:"O împărțire la restaurant are nevoie de cel puțin un participant.",
  settle_desc:"Folosește cât mai puține plăți sau redirecționează una prin alt membru.", group_balances:"Soldurile grupului", balance_help:"Soldurile pozitive primesc bani.", payments_to_make:"Plăți de făcut", route_help:"Alege alt traseu fără a modifica soldul final.", no_balances:"Nu există solduri", no_balances_desc:"Adaugă persoane și cheltuieli pentru calcul.", gets_back:"primește", everything_even:"Totul este egal.", no_payments:"Nu sunt necesare plăți.", add_first_expense:"Adaugă prima cheltuială când ești gata.", pays:"plătește", cant_pay_direct:"Nu poți plăti direct?", pay_directly:"Plătește direct", pay_via:"Plătește prin {name}", route_steps:"Traseu în doi pași", first_pay:"Mai întâi, {from} plătește lui {via}", then_pay:"Apoi, {via} plătește lui {to}", no_route_people:"Adaugă un al treilea membru pentru un traseu alternativ.",
  logistics_desc:"Camere, mașini și detaliile de care are nevoie toată lumea.", add_accommodation:"Adaugă cazare", add_stay:"Adaugă cazare", stays_rooms:"Cazări și camere", stays_help:"Adaugă proprietățile, alocă persoanele și împarte fiecare cameră.", no_stays:"Nu există cazări", no_stays_desc:"Adaugă prima cazare și începe alocarea camerelor.", stay_name:"Numele cazării", location:"Locație", nights:"Nopți", create_stay:"Creează cazarea", add_room:"Adaugă cameră", room:"Cameră", capacity:"Capacitate", assigned:"Alocat", room_total:"Total cameră", room_split:"{amount} per oaspete în această cameră", room_empty:"Alocă oaspeți pentru a calcula împărțirea.", comments:"Comentarii", add_comment:"Adaugă comentariu", comment_placeholder:"Lasă o notă pentru grup…",
  cars_seats:"Mașini și locuri", cars_help:"Alege șoferul, numărul de locuri și pasagerii fiecărei mașini.", add_car:"Adaugă mașină", no_cars:"Nu există mașini", no_cars_desc:"Adaugă o mașină pentru a coordona șoferii și locurile.", car_name:"Numele mașinii", seats:"Locuri", driver:"Șofer", choose_driver:"Alege șofer", passengers:"Pasageri", seat_open:"1 loc liber", seats_open:"{count} locuri libere", car_full:"Mașina este plină", create_car:"Creează mașina", accommodation_total:"Total cazare", logistics_saved:"Fiecare schimbare se salvează automat în excursie.",
  stay_price:"Preț total cazare", split_method:"Metodă de împărțire", split_by_people:"Egal între oaspeți", split_by_rooms:"Egal între camerele ocupate", who_stayed:"Cine a stat aici", who_stayed_help:"Selectează toate persoanele incluse în această cazare.", room_share:"Partea camerei", included_guest_split:"Inclus în împărțirea pe oaspeți", split_preview:"Previzualizare împărțire", select_participants_first:"Selectează participanții pentru a calcula împărțirea.", car_rental_total:"Total închirieri auto", rental_car:"Mașină închiriată", rental_help:"Urmărește închirierea separat de locuri și condus.", rental_enabled:"Închiriere activă", not_rental:"Nu este închiriată", rental_price:"Preț total închiriere", per_participant:"per participant", rental_participants:"Cine împarte închirierea", rental_participants_help:"Alege cine contribuie la costul închirierii.", rental_split:"Împărțirea închirierii", planned_split:"Împărțirea costurilor planificate", planned_split_desc:"Cazare și închirieri auto în moneda selectată.", stays:"Cazări", rentals:"Închirieri",
  flights:"Zboruri", flights_help:"Adaugă fiecare zbor, itinerarul, prețul și persoanele care călătoresc.", flight_total:"Total zboruri", add_flight:"Adaugă zbor", no_flights:"Nu există zboruri", no_flights_desc:"Adaugă un zbor pentru a coordona călătoria și a împărți biletele.", flight:"Zbor", from_airport:"Aeroport plecare", to_airport:"Aeroport sosire", airline:"Companie aeriană", flight_number:"Număr zbor", departure:"Plecare", arrival:"Sosire", total_fare:"Preț total bilete", create_flight:"Creează zbor", who_is_flying:"Cine zboară", flight_participants_help:"Alege toate persoanele incluse în acest preț.", flight_split:"Împărțirea zborului",
  chat_desc:"Un spațiu simplu pentru decizii, mementouri și detalii de sosire.", no_messages:"Nu există mesaje", no_messages_desc:"Începe conversația cu primul detaliu al excursiei.", type_message:"Scrie un mesaj…", send:"Trimite", visible_all:"Vizibil tuturor membrilor", sending_as:"Trimiți ca",
  share_room_title:"Împarte o cameră. Fără cont.", guest_intro:"Folosește codul camerei, alege numele existent sau intră cu o poreclă nouă. Nu ai nevoie de cont.", no_signup:"Fără înregistrare", guest_storage:"Camerele de oaspeți sunt stocate în acest browser în etapa de prototip.", create_guest_room:"Creează o cameră de oaspeți", trip_name:"Numele excursiei", create_room:"Creează camera", or_join:"sau intră într-una", room_code:"Codul camerei", join:"Intră", nickname_required:"Adaugă o poreclă înainte de a continua.", room_not_found:"Nu am găsit camera în acest browser.", nickname_hint:"Așa te va vedea grupul.",
  how_it_works:"Cum funcționează", for_groups:"Pentru grupuri", sign_in:"Autentificare", hero_title:"Excursiile sunt mai frumoase când banii rămân simpli.", hero_desc:"Urmărește costurile comune, scanează bonul la cină și decontează corect în mai multe monede.", start_local_trip:"Începe o excursie locală", open_guest_room:"Deschide o cameră de oaspeți", no_account_choice:"Nu ai nevoie de cont. Alege modul local sau o cameră partajabilă.",
  join_guest_room:"Intră într-o cameră de oaspeți", find_room:"Găsește camera", room_found:"Cameră găsită", already_listed:"Ești deja în această excursie?", claim_existing_help:"Alege numele existent pentru a păstra costurile și alocările conectate.", choose_existing_person:"Alege numele înainte de a intra.", person_already_claimed:"Această persoană a intrat deja. Alege alt nume sau folosește o poreclă nouă.", join_as:"Intră ca {name}", choose_your_name:"Alege numele", or_new_nickname:"sau intră ca persoană nouă", no_names_available:"Toate persoanele din listă au intrat deja. Folosește o poreclă nouă.", new_nickname:"Poreclă nouă", new_nickname_hint:"Folosește-o doar dacă nu ești deja în listă.", join_as_new:"Intră ca persoană nouă",
  pending:"În așteptare", history:"Istoric", mark_as_paid:"Marchează ca plătit", paid:"a plătit lui", paid_on:"Plătit la {date}", paid_via:"prin {name}", confirm_payment:"Confirmă plata", confirm_payment_desc:"Aceasta actualizează soldurile și mută plata în Istoric.", confirm_paid:"Confirmă plata", no_payment_history:"Nu există istoric de plăți", no_payment_history_desc:"Plățile confirmate vor apărea aici.",
};

const es = {
  overview:"Resumen", expenses:"Gastos", scan_receipt:"Escanear recibo", scan:"Escanear", restaurant_split:"Dividir restaurante", split:"Dividir", settle_up:"Saldar", settle:"Saldar", trip_logistics:"Logística del viaje", plan:"Plan", group_chat:"Chat del grupo", chat:"Chat", current_trip:"Viaje actual", untitled_trip:"Viaje sin título", guest_room:"Sala de invitados", shared_room:"Sala compartida", copy_invite:"Copiar invitación", invite_copied:"Invitación copiada", saved_device:"Guardado en este dispositivo", all_trips:"Todos los viajes", leave_trip:"Salir del viaje", back_home:"Volver", cancel:"Cancelar", remove:"Eliminar", add:"Añadir", save:"Guardar", name:"Nombre", nickname:"Apodo", currency:"Moneda", amount:"Importe", total:"Total", people:"Personas", person:"persona", select_all:"Seleccionar todo", unassigned:"Sin asignar", admin:"Admin", member:"Miembro", you:"Tú", make_admin:"Hacer admin", remove_admin:"Quitar admin", creator_admin_note:"El creador empieza como admin y puede ascender a otros miembros.", role_help:"Los administradores gestionan miembros y permisos. Los gastos son visibles para todos.",
  trip_overview:"Resumen del viaje", overview_desc:"Las personas, saldos y monedas de este viaje.", add_expense:"Añadir gasto", total_spent:"Total gastado", per_person:"Por persona", rates_updated:"Tipos actualizados", live_rates:"Tipos BCE en vivo", refresh_rates:"Actualizar tipos", updating_rates:"Actualizandoâ€¦", add_everyone:"Añade a quien pueda pagar o contribuir.", add_person:"Añadir persona", start_group:"Empieza con el grupo", start_group_desc:"Añade al menos dos personas y después un gasto compartido.", currency_desk:"Mesa de divisas", currency_desc:"Valores de referencia del BCE por 1 €.", use_rates:"Usar estos tipos en un gasto", gets:"recibe", owes:"debe", settled:"saldado",
  expenses_desc:"Todos los gastos compartidos, en un solo lugar.", recent_expenses:"Gastos recientes", add_an_expense:"Añadir un gasto", description:"Descripción", what_for:"¿Para qué fue?", paid_by:"Pagado por", split_equally:"Dividir por igual", custom_amounts:"Importes personalizados", split_between:"Dividir entre", save_expense:"Guardar gasto", add_people_first:"Añade personas primero", group_needs_names:"El grupo necesita nombres antes de compartir un gasto.", no_expenses:"Aún no hay gastos", no_expenses_desc:"Usa el formulario, escanea un recibo o divide una cuenta de restaurante.",
  scan_title:"Escanear un recibo", scan_desc:"Haz una foto. Revisa los artículos. Elige quién compartió cada uno.", add_group_first:"Añade el grupo primero", receipt_people_desc:"Los artículos necesitan participantes antes de guardarse.", photograph_upload:"Fotografiar o subir", reading_receipt:"Leyendo el recibo…", scan_prototype_note:"En móvil, la primera opción abre la cámara. La lectura se simula localmente hasta conectar OCR.", take_photo:"Hacer foto", choose_library:"Elegir de la galería", sample_receipt:"Usar recibo de ejemplo", tap_initials:"Toca las iniciales para cambiar quién compartió un artículo.", add_items_trip:"Añadir {count} artículos al viaje",
  restaurant_desc:"Asigna platos, comparte los costes de mesa y salda una vez.", restaurant:"Restaurante", item:"Artículo", shared_with:"Compartido con", add_item:"Añadir otro artículo", tip:"Propina", tax:"Impuesto", table_total:"Total de la mesa", save_restaurant:"Guardar división", restaurant_people_desc:"La división de restaurante necesita al menos un comensal.",
  settle_desc:"Usa el mínimo de pagos o redirige uno mediante otro miembro.", group_balances:"Saldos del grupo", balance_help:"Los saldos positivos reciben dinero.", payments_to_make:"Pagos pendientes", route_help:"Elige otra ruta sin cambiar el saldo final.", no_balances:"Aún no hay saldos", no_balances_desc:"Añade personas y gastos para calcularlos.", gets_back:"recibe", everything_even:"Todo está equilibrado.", no_payments:"No hacen falta pagos.", add_first_expense:"Añade el primer gasto cuando quieras.", pays:"paga a", cant_pay_direct:"¿No puedes pagar directamente?", pay_directly:"Pagar directamente", pay_via:"Pagar mediante {name}", route_steps:"Ruta de pago en dos pasos", first_pay:"Primero, {from} paga a {via}", then_pay:"Después, {via} paga a {to}", no_route_people:"Añade un tercer miembro para usar otra ruta.",
  logistics_desc:"Habitaciones, coches y los detalles que todos necesitan.", add_accommodation:"Añadir alojamiento", add_stay:"Añadir estancia", stays_rooms:"Estancias y habitaciones", stays_help:"Añade cada propiedad, asigna personas y divide cada habitación.", no_stays:"Aún no hay estancias", no_stays_desc:"Añade el primer alojamiento y empieza a asignar habitaciones.", stay_name:"Nombre del alojamiento", location:"Ubicación", nights:"Noches", create_stay:"Crear estancia", add_room:"Añadir habitación", room:"Habitación", capacity:"Capacidad", assigned:"Asignado", room_total:"Total habitación", room_split:"{amount} por huésped en esta habitación", room_empty:"Asigna huéspedes para calcular la división.", comments:"Comentarios", add_comment:"Añadir comentario", comment_placeholder:"Comparte una nota con el grupo…",
  cars_seats:"Coches y plazas", cars_help:"Define conductor, plazas y quién viaja en cada coche.", add_car:"Añadir coche", no_cars:"Aún no hay coches", no_cars_desc:"Añade un coche para coordinar conductores y plazas.", car_name:"Nombre del coche", seats:"Plazas", driver:"Conductor", choose_driver:"Elegir conductor", passengers:"Pasajeros", seat_open:"1 plaza libre", seats_open:"{count} plazas libres", car_full:"Coche completo", create_car:"Crear coche", accommodation_total:"Total alojamiento", logistics_saved:"Cada cambio se guarda automáticamente en este viaje.",
  stay_price:"Precio total de la estancia", split_method:"Método de reparto", split_by_people:"Igual por huéspedes", split_by_rooms:"Igual por habitaciones ocupadas", who_stayed:"Quién se alojó aquí", who_stayed_help:"Selecciona a todos los incluidos en este alojamiento.", room_share:"Parte de la habitación", included_guest_split:"Incluido en el reparto por huéspedes", split_preview:"Vista previa del reparto", select_participants_first:"Selecciona participantes para calcular el reparto.", car_rental_total:"Total alquileres de coche", rental_car:"Coche de alquiler", rental_help:"Registra el alquiler aparte de las plazas y la conducción.", rental_enabled:"Alquiler activado", not_rental:"No es de alquiler", rental_price:"Precio total del alquiler", per_participant:"por participante", rental_participants:"Quién comparte este alquiler", rental_participants_help:"Elige quién contribuye al coste del alquiler.", rental_split:"Reparto del alquiler", planned_split:"Reparto de costes previsto", planned_split_desc:"Alojamiento y alquiler de coches en la moneda seleccionada.", stays:"Estancias", rentals:"Alquileres",
  flights:"Vuelos", flights_help:"Añade cada vuelo, itinerario, tarifa y las personas que viajan.", flight_total:"Total vuelos", add_flight:"Añadir vuelo", no_flights:"Aún no hay vuelos", no_flights_desc:"Añade un vuelo para coordinar el viaje y repartir los billetes.", flight:"Vuelo", from_airport:"Aeropuerto de origen", to_airport:"Aeropuerto de destino", airline:"Aerolínea", flight_number:"Número de vuelo", departure:"Salida", arrival:"Llegada", total_fare:"Tarifa total", create_flight:"Crear vuelo", who_is_flying:"Quién vuela", flight_participants_help:"Elige a todos los incluidos en esta tarifa.", flight_split:"Reparto del vuelo",
  chat_desc:"Un espacio sencillo para decisiones, recordatorios y llegadas.", no_messages:"Aún no hay mensajes", no_messages_desc:"Empieza la conversación con la primera novedad.", type_message:"Escribe un mensaje…", send:"Enviar", visible_all:"Visible para todos los miembros", sending_as:"Enviando como",
  share_room_title:"Comparte una sala. Sin cuenta.", guest_intro:"Usa el código de sala, elige tu nombre existente o entra con un apodo nuevo. No necesitas cuenta.", no_signup:"Sin registro", guest_storage:"Las salas de invitados se guardan en este navegador durante el prototipo.", create_guest_room:"Crear sala de invitados", trip_name:"Nombre del viaje", create_room:"Crear sala", or_join:"o únete a una", room_code:"Código de sala", join:"Unirse", nickname_required:"Añade un apodo antes de continuar.", room_not_found:"No encontramos esa sala en este navegador.", nickname_hint:"Así te verá el grupo.",
  how_it_works:"Cómo funciona", for_groups:"Para grupos", sign_in:"Iniciar sesión", hero_title:"Los viajes son mejores cuando el dinero es sencillo.", hero_desc:"Registra cada gasto compartido, escanea el recibo y salda el grupo de forma justa en varias monedas.", start_local_trip:"Empezar un viaje local", open_guest_room:"Abrir sala de invitados", no_account_choice:"No necesitas cuenta. Elige un viaje local o una sala compartible.",
  join_guest_room:"Unirse a una sala de invitados", find_room:"Buscar sala", room_found:"Sala encontrada", already_listed:"¿Ya estás en este viaje?", claim_existing_help:"Elige tu nombre existente para mantener conectados tus gastos y asignaciones.", choose_existing_person:"Elige tu nombre antes de entrar.", person_already_claimed:"Esa persona ya se ha unido. Elige otro nombre o usa un apodo nuevo.", join_as:"Entrar como {name}", choose_your_name:"Elige tu nombre", or_new_nickname:"o entra como alguien nuevo", no_names_available:"Todas las personas de la lista ya se han unido. Usa un apodo nuevo.", new_nickname:"Apodo nuevo", new_nickname_hint:"Úsalo solo si aún no apareces en la lista.", join_as_new:"Entrar como persona nueva",
  pending:"Pendientes", history:"Historial", mark_as_paid:"Marcar como pagado", paid:"pagó a", paid_on:"Pagado el {date}", paid_via:"mediante {name}", confirm_payment:"Confirmar pago", confirm_payment_desc:"Esto actualiza los saldos y mueve el pago al Historial.", confirm_paid:"Confirmar como pagado", no_payment_history:"Aún no hay historial de pagos", no_payment_history_desc:"Los pagos confirmados aparecerán aquí.",
};

const fr = {
  overview:"Aperçu", expenses:"Dépenses", scan_receipt:"Scanner un reçu", scan:"Scanner", restaurant_split:"Addition restaurant", split:"Partager", settle_up:"Régler", settle:"Régler", trip_logistics:"Logistique du voyage", plan:"Plan", group_chat:"Discussion", chat:"Chat", current_trip:"Voyage actuel", untitled_trip:"Voyage sans titre", guest_room:"Salon invité", shared_room:"Salon partagé", copy_invite:"Copier l’invitation", invite_copied:"Invitation copiée", saved_device:"Enregistré sur cet appareil", all_trips:"Tous les voyages", leave_trip:"Quitter le voyage", back_home:"Retour", cancel:"Annuler", remove:"Supprimer", add:"Ajouter", save:"Enregistrer", name:"Nom", nickname:"Pseudo", currency:"Devise", amount:"Montant", total:"Total", people:"Personnes", person:"personne", select_all:"Tout sélectionner", unassigned:"Non attribué", admin:"Admin", member:"Membre", you:"Vous", make_admin:"Nommer admin", remove_admin:"Retirer admin", creator_admin_note:"Le créateur est admin et peut promouvoir d’autres membres.", role_help:"Les admins gèrent les membres et les accès. Les dépenses restent visibles par tous.",
  trip_overview:"Aperçu du voyage", overview_desc:"Les personnes, soldes et devises de ce voyage.", add_expense:"Ajouter une dépense", total_spent:"Total dépensé", per_person:"Par personne", rates_updated:"Taux actualisés", live_rates:"Taux BCE en direct", refresh_rates:"Actualiser les taux", updating_rates:"Actualisationâ€¦", add_everyone:"Ajoutez toutes les personnes susceptibles de payer ou contribuer.", add_person:"Ajouter une personne", start_group:"Commencez par le groupe", start_group_desc:"Ajoutez au moins deux personnes, puis une dépense partagée.", currency_desk:"Bureau de change", currency_desc:"Valeurs de référence BCE pour 1 €.", use_rates:"Utiliser ces taux", gets:"reçoit", owes:"doit", settled:"réglé",
  expenses_desc:"Chaque dépense partagée, au même endroit.", recent_expenses:"Dépenses récentes", add_an_expense:"Ajouter une dépense", description:"Description", what_for:"À quoi cela correspond ?", paid_by:"Payé par", split_equally:"Partager également", custom_amounts:"Montants personnalisés", split_between:"Partager entre", save_expense:"Enregistrer la dépense", add_people_first:"Ajoutez d’abord des personnes", group_needs_names:"Le groupe a besoin de noms avant de partager un coût.", no_expenses:"Aucune dépense", no_expenses_desc:"Utilisez le formulaire, scannez un reçu ou partagez une addition.",
  scan_title:"Scanner un reçu", scan_desc:"Prenez une photo. Vérifiez les articles. Choisissez les participants.", add_group_first:"Ajoutez d’abord le groupe", receipt_people_desc:"Les articles doivent avoir des participants avant l’enregistrement.", photograph_upload:"Photographier ou importer", reading_receipt:"Lecture du reçu…", scan_prototype_note:"Sur mobile, la première option ouvre l’appareil photo. La lecture est simulée jusqu’à la connexion OCR.", take_photo:"Prendre une photo", choose_library:"Choisir dans la galerie", sample_receipt:"Utiliser le reçu exemple", tap_initials:"Touchez les initiales pour modifier le partage.", add_items_trip:"Ajouter {count} articles au voyage",
  restaurant_desc:"Attribuez les plats, partagez les frais de table et réglez une fois.", restaurant:"Restaurant", item:"Article", shared_with:"Partagé avec", add_item:"Ajouter un article", tip:"Pourboire", tax:"Taxe", table_total:"Total de la table", save_restaurant:"Enregistrer le partage", restaurant_people_desc:"Un partage de restaurant nécessite au moins un convive.",
  settle_desc:"Utilisez le moins de paiements possible ou faites transiter un paiement par un autre membre.", group_balances:"Soldes du groupe", balance_help:"Les soldes positifs reçoivent de l’argent.", payments_to_make:"Paiements à effectuer", route_help:"Choisissez un autre trajet sans modifier les soldes finaux.", no_balances:"Aucun solde", no_balances_desc:"Ajoutez des personnes et des dépenses pour calculer les soldes.", gets_back:"reçoit", everything_even:"Tout est équilibré.", no_payments:"Aucun paiement nécessaire.", add_first_expense:"Ajoutez la première dépense quand vous êtes prêt.", pays:"paie", cant_pay_direct:"Paiement direct impossible ?", pay_directly:"Payer directement", pay_via:"Payer via {name}", route_steps:"Paiement en deux étapes", first_pay:"D’abord, {from} paie {via}", then_pay:"Puis, {via} paie {to}", no_route_people:"Ajoutez un troisième membre pour un autre trajet.",
  logistics_desc:"Chambres, voitures et détails utiles à tout le monde.", add_accommodation:"Ajouter un hébergement", add_stay:"Ajouter un séjour", stays_rooms:"Séjours et chambres", stays_help:"Ajoutez chaque logement, placez les personnes et partagez chaque chambre.", no_stays:"Aucun séjour", no_stays_desc:"Ajoutez le premier hébergement et attribuez les chambres.", stay_name:"Nom de l’hébergement", location:"Lieu", nights:"Nuits", create_stay:"Créer le séjour", add_room:"Ajouter une chambre", room:"Chambre", capacity:"Capacité", assigned:"Attribué", room_total:"Total chambre", room_split:"{amount} par personne dans cette chambre", room_empty:"Attribuez des personnes pour calculer le partage.", comments:"Commentaires", add_comment:"Ajouter un commentaire", comment_placeholder:"Partagez une note avec le groupe…",
  cars_seats:"Voitures et places", cars_help:"Définissez le conducteur, les places et les passagers.", add_car:"Ajouter une voiture", no_cars:"Aucune voiture", no_cars_desc:"Ajoutez une voiture pour coordonner les conducteurs et les places.", car_name:"Nom de la voiture", seats:"Places", driver:"Conducteur", choose_driver:"Choisir le conducteur", passengers:"Passagers", seat_open:"1 place libre", seats_open:"{count} places libres", car_full:"Voiture complète", create_car:"Créer la voiture", accommodation_total:"Total hébergement", logistics_saved:"Chaque modification est automatiquement enregistrée.",
  stay_price:"Prix total du séjour", split_method:"Méthode de partage", split_by_people:"Égal par personne", split_by_rooms:"Égal par chambre occupée", who_stayed:"Qui a séjourné ici", who_stayed_help:"Sélectionnez toutes les personnes incluses dans cet hébergement.", room_share:"Part de la chambre", included_guest_split:"Inclus dans le partage par personne", split_preview:"Aperçu du partage", select_participants_first:"Sélectionnez des participants pour calculer le partage.", car_rental_total:"Total locations de voiture", rental_car:"Voiture de location", rental_help:"Suivez la location séparément des places et de la conduite.", rental_enabled:"Location activée", not_rental:"Pas une location", rental_price:"Prix total de location", per_participant:"par participant", rental_participants:"Qui partage cette location", rental_participants_help:"Choisissez qui contribue au coût de la location.", rental_split:"Partage de la location", planned_split:"Partage des coûts prévus", planned_split_desc:"Hébergement et location de voitures dans la devise choisie.", stays:"Séjours", rentals:"Locations",
  flights:"Vols", flights_help:"Ajoutez chaque vol, itinéraire, tarif et les voyageurs.", flight_total:"Total vols", add_flight:"Ajouter un vol", no_flights:"Aucun vol", no_flights_desc:"Ajoutez un vol pour coordonner le trajet et partager les billets.", flight:"Vol", from_airport:"Aéroport de départ", to_airport:"Aéroport d’arrivée", airline:"Compagnie aérienne", flight_number:"Numéro de vol", departure:"Départ", arrival:"Arrivée", total_fare:"Tarif total", create_flight:"Créer le vol", who_is_flying:"Qui prend ce vol", flight_participants_help:"Choisissez toutes les personnes incluses dans ce tarif.", flight_split:"Partage du vol",
  chat_desc:"Un espace simple pour les décisions, rappels et arrivées.", no_messages:"Aucun message", no_messages_desc:"Lancez la conversation avec la première information.", type_message:"Écrire un message…", send:"Envoyer", visible_all:"Visible par tous les membres", sending_as:"Envoyé en tant que",
  share_room_title:"Partagez un salon. Sans compte.", guest_intro:"Utilisez le code du salon, choisissez votre nom existant ou rejoignez avec un nouveau pseudo. Aucun compte requis.", no_signup:"Sans inscription", guest_storage:"Les salons invités sont stockés dans ce navigateur pendant le prototype.", create_guest_room:"Créer un salon invité", trip_name:"Nom du voyage", create_room:"Créer le salon", or_join:"ou rejoindre", room_code:"Code du salon", join:"Rejoindre", nickname_required:"Ajoutez un pseudo avant de continuer.", room_not_found:"Ce salon est introuvable dans ce navigateur.", nickname_hint:"C’est ainsi que le groupe vous verra.",
  how_it_works:"Comment ça marche", for_groups:"Pour les groupes", sign_in:"Se connecter", hero_title:"Les voyages sont meilleurs quand l’argent reste simple.", hero_desc:"Suivez chaque dépense partagée, scannez le reçu et équilibrez le groupe équitablement dans plusieurs devises.", start_local_trip:"Créer un voyage local", open_guest_room:"Ouvrir un salon invité", no_account_choice:"Aucun compte requis. Choisissez un voyage local ou un salon à partager.",
  join_guest_room:"Rejoindre un salon invité", find_room:"Trouver le salon", room_found:"Salon trouvé", already_listed:"Êtes-vous déjà dans ce voyage ?", claim_existing_help:"Choisissez votre nom existant pour conserver vos dépenses et attributions.", choose_existing_person:"Choisissez votre nom avant de rejoindre.", person_already_claimed:"Cette personne a déjà rejoint le groupe. Choisissez un autre nom ou un nouveau pseudo.", join_as:"Rejoindre en tant que {name}", choose_your_name:"Choisissez votre nom", or_new_nickname:"ou rejoindre comme nouvelle personne", no_names_available:"Toutes les personnes listées ont déjà rejoint. Utilisez un nouveau pseudo.", new_nickname:"Nouveau pseudo", new_nickname_hint:"Utilisez-le uniquement si vous n’êtes pas déjà dans la liste.", join_as_new:"Rejoindre comme nouvelle personne",
  pending:"En attente", history:"Historique", mark_as_paid:"Marquer comme payé", paid:"a payé", paid_on:"Payé le {date}", paid_via:"via {name}", confirm_payment:"Confirmer le paiement", confirm_payment_desc:"Cela actualise les soldes et déplace le paiement dans l’Historique.", confirm_paid:"Confirmer comme payé", no_payment_history:"Aucun historique de paiement", no_payment_history_desc:"Les paiements confirmés apparaîtront ici.",
};

const de = {
  overview:"Übersicht", expenses:"Ausgaben", scan_receipt:"Beleg scannen", scan:"Scannen", restaurant_split:"Restaurant teilen", split:"Teilen", settle_up:"Ausgleichen", settle:"Ausgleich", trip_logistics:"Reiselogistik", plan:"Plan", group_chat:"Gruppenchat", chat:"Chat", current_trip:"Aktuelle Reise", untitled_trip:"Unbenannte Reise", guest_room:"Gastraum", shared_room:"Geteilter Raum", copy_invite:"Einladung kopieren", invite_copied:"Einladung kopiert", saved_device:"Auf diesem Gerät gespeichert", all_trips:"Alle Reisen", leave_trip:"Reise verlassen", back_home:"Zurück", cancel:"Abbrechen", remove:"Entfernen", add:"Hinzufügen", save:"Speichern", name:"Name", nickname:"Spitzname", currency:"Währung", amount:"Betrag", total:"Gesamt", people:"Personen", person:"Person", select_all:"Alle auswählen", unassigned:"Nicht zugewiesen", admin:"Admin", member:"Mitglied", you:"Du", make_admin:"Zum Admin machen", remove_admin:"Admin entfernen", creator_admin_note:"Der Ersteller ist Admin und kann weitere Mitglieder ernennen.", role_help:"Admins verwalten Mitglieder und Rechte. Ausgaben bleiben für alle sichtbar.",
  trip_overview:"Reiseübersicht", overview_desc:"Personen, Salden und Währungen dieser Reise.", add_expense:"Ausgabe hinzufügen", total_spent:"Gesamtausgaben", per_person:"Pro Person", rates_updated:"Kurse aktualisiert", live_rates:"Live-EZB-Kurse", refresh_rates:"Kurse aktualisieren", updating_rates:"Wird aktualisiertâ€¦", add_everyone:"Füge alle hinzu, die zahlen oder beitragen können.", add_person:"Person hinzufügen", start_group:"Mit der Gruppe beginnen", start_group_desc:"Füge mindestens zwei Personen und dann gemeinsame Kosten hinzu.", currency_desk:"Währungen", currency_desc:"EZB-Referenzwerte pro 1 €.", use_rates:"Kurse für eine Ausgabe nutzen", gets:"erhält", owes:"schuldet", settled:"ausgeglichen",
  expenses_desc:"Alle gemeinsamen Kosten an einem Ort.", recent_expenses:"Letzte Ausgaben", add_an_expense:"Ausgabe hinzufügen", description:"Beschreibung", what_for:"Wofür war das?", paid_by:"Bezahlt von", split_equally:"Gleichmäßig teilen", custom_amounts:"Eigene Beträge", split_between:"Aufteilen zwischen", save_expense:"Ausgabe speichern", add_people_first:"Zuerst Personen hinzufügen", group_needs_names:"Die Gruppe braucht Namen, bevor Kosten geteilt werden.", no_expenses:"Noch keine Ausgaben", no_expenses_desc:"Nutze das Formular, scanne einen Beleg oder teile eine Restaurantrechnung.",
  scan_title:"Beleg scannen", scan_desc:"Foto aufnehmen. Posten prüfen. Beteiligte auswählen.", add_group_first:"Zuerst die Gruppe hinzufügen", receipt_people_desc:"Belegposten brauchen Beteiligte, bevor sie gespeichert werden.", photograph_upload:"Fotografieren oder hochladen", reading_receipt:"Beleg wird gelesen…", scan_prototype_note:"Auf Mobilgeräten öffnet die erste Option die Kamera. Das Lesen wird bis zur OCR-Anbindung lokal simuliert.", take_photo:"Foto aufnehmen", choose_library:"Aus Galerie wählen", sample_receipt:"Beispielbeleg nutzen", tap_initials:"Initialen antippen, um Beteiligte zu ändern.", add_items_trip:"{count} Posten zur Reise hinzufügen",
  restaurant_desc:"Gerichte zuweisen, Tischkosten teilen und einmal ausgleichen.", restaurant:"Restaurant", item:"Posten", shared_with:"Geteilt mit", add_item:"Weiteren Posten hinzufügen", tip:"Trinkgeld", tax:"Steuer", table_total:"Tischsumme", save_restaurant:"Restaurantaufteilung speichern", restaurant_people_desc:"Eine Restaurantaufteilung braucht mindestens einen Gast.",
  settle_desc:"Nutze möglichst wenige Zahlungen oder leite eine Zahlung über ein anderes Mitglied um.", group_balances:"Gruppensalden", balance_help:"Positive Salden erhalten Geld.", payments_to_make:"Offene Zahlungen", route_help:"Wähle einen anderen Weg, ohne die Endsalden zu ändern.", no_balances:"Noch keine Salden", no_balances_desc:"Füge Personen und Ausgaben hinzu, um Salden zu berechnen.", gets_back:"erhält", everything_even:"Alles ist ausgeglichen.", no_payments:"Keine Zahlungen nötig.", add_first_expense:"Füge die erste Ausgabe hinzu, wenn du bereit bist.", pays:"zahlt an", cant_pay_direct:"Direkte Zahlung nicht möglich?", pay_directly:"Direkt bezahlen", pay_via:"Über {name} bezahlen", route_steps:"Zahlung in zwei Schritten", first_pay:"Zuerst zahlt {from} an {via}", then_pay:"Dann zahlt {via} an {to}", no_route_people:"Füge ein drittes Mitglied für eine alternative Route hinzu.",
  logistics_desc:"Zimmer, Fahrten und die Details, die alle brauchen.", add_accommodation:"Unterkunft hinzufügen", add_stay:"Aufenthalt hinzufügen", stays_rooms:"Unterkünfte & Zimmer", stays_help:"Füge jede Unterkunft hinzu, verteile Personen und teile jedes Zimmer fair.", no_stays:"Noch keine Unterkunft", no_stays_desc:"Füge die erste Unterkunft hinzu und verteile Zimmer.", stay_name:"Name der Unterkunft", location:"Ort", nights:"Nächte", create_stay:"Unterkunft erstellen", add_room:"Zimmer hinzufügen", room:"Zimmer", capacity:"Kapazität", assigned:"Zugewiesen", room_total:"Zimmer gesamt", room_split:"{amount} pro Gast in diesem Zimmer", room_empty:"Gäste zuweisen, um die Aufteilung zu berechnen.", comments:"Kommentare", add_comment:"Kommentar hinzufügen", comment_placeholder:"Notiz mit der Gruppe teilen…",
  cars_seats:"Autos & Plätze", cars_help:"Fahrer, Sitzanzahl und Mitfahrer für jedes Auto festlegen.", add_car:"Auto hinzufügen", no_cars:"Noch keine Autos", no_cars_desc:"Füge ein Auto hinzu, um Fahrer und freie Plätze zu koordinieren.", car_name:"Name des Autos", seats:"Plätze", driver:"Fahrer", choose_driver:"Fahrer wählen", passengers:"Mitfahrer", seat_open:"1 Platz frei", seats_open:"{count} Plätze frei", car_full:"Auto voll", create_car:"Auto erstellen", accommodation_total:"Unterkunft gesamt", logistics_saved:"Jede Änderung wird automatisch in dieser Reise gespeichert.",
  stay_price:"Gesamtpreis der Unterkunft", split_method:"Aufteilung", split_by_people:"Gleich pro Gast", split_by_rooms:"Gleich pro belegtem Zimmer", who_stayed:"Wer hat hier übernachtet", who_stayed_help:"Wähle alle Personen dieser Unterkunft aus.", room_share:"Zimmeranteil", included_guest_split:"In Gästeaufteilung enthalten", split_preview:"Vorschau der Aufteilung", select_participants_first:"Teilnehmer auswählen, um die Aufteilung zu berechnen.", car_rental_total:"Mietwagen gesamt", rental_car:"Mietwagen", rental_help:"Mietkosten getrennt von Sitzen und Fahrten erfassen.", rental_enabled:"Miete aktiviert", not_rental:"Kein Mietwagen", rental_price:"Gesamtpreis der Miete", per_participant:"pro Teilnehmer", rental_participants:"Wer teilt diese Miete", rental_participants_help:"Wähle aus, wer sich an den Mietkosten beteiligt.", rental_split:"Aufteilung der Miete", planned_split:"Geplante Kostenaufteilung", planned_split_desc:"Unterkunft und Mietwagen in der ausgewählten Währung.", stays:"Unterkünfte", rentals:"Mietwagen",
  flights:"Flüge", flights_help:"Füge jeden Flug, die Route, den Preis und alle Reisenden hinzu.", flight_total:"Flüge gesamt", add_flight:"Flug hinzufügen", no_flights:"Noch keine Flüge", no_flights_desc:"Füge einen Flug hinzu, um die Reise zu planen und Ticketkosten zu teilen.", flight:"Flug", from_airport:"Abflughafen", to_airport:"Zielflughafen", airline:"Fluggesellschaft", flight_number:"Flugnummer", departure:"Abflug", arrival:"Ankunft", total_fare:"Gesamtpreis", create_flight:"Flug erstellen", who_is_flying:"Wer fliegt", flight_participants_help:"Wähle alle Personen, die in diesem Preis enthalten sind.", flight_split:"Flugaufteilung",
  chat_desc:"Ein einfacher Raum für Entscheidungen, Erinnerungen und Ankunftsdetails.", no_messages:"Noch keine Nachrichten", no_messages_desc:"Beginne die Unterhaltung mit dem ersten Reise-Update.", type_message:"Nachricht schreiben…", send:"Senden", visible_all:"Für alle Reisemitglieder sichtbar", sending_as:"Senden als",
  share_room_title:"Raum teilen. Ohne Konto.", guest_intro:"Nutze den Raumcode, wähle deinen vorhandenen Namen oder tritt mit einem neuen Spitznamen bei. Kein Konto nötig.", no_signup:"Keine Anmeldung", guest_storage:"Gasträume werden während der Prototypphase in diesem Browser gespeichert.", create_guest_room:"Gastraum erstellen", trip_name:"Reisename", create_room:"Raum erstellen", or_join:"oder beitreten", room_code:"Raumcode", join:"Beitreten", nickname_required:"Bitte vor dem Fortfahren einen Spitznamen angeben.", room_not_found:"Dieser Raum wurde in diesem Browser nicht gefunden.", nickname_hint:"So sieht dich die Gruppe.",
  how_it_works:"So funktioniert es", for_groups:"Für Gruppen", sign_in:"Anmelden", hero_title:"Reisen sind besser, wenn Geld einfach bleibt.", hero_desc:"Erfasse gemeinsame Kosten, scanne den Beleg und gleiche die Gruppe fair in mehreren Währungen aus.", start_local_trip:"Lokale Reise starten", open_guest_room:"Gastraum öffnen", no_account_choice:"Kein Konto nötig. Wähle eine lokale Reise oder einen teilbaren Gastraum.",
  join_guest_room:"Einem Gastraum beitreten", find_room:"Raum finden", room_found:"Raum gefunden", already_listed:"Bist du bereits in dieser Reise?", claim_existing_help:"Wähle deinen vorhandenen Namen, damit Kosten und Zuweisungen verbunden bleiben.", choose_existing_person:"Wähle deinen Namen vor dem Beitritt.", person_already_claimed:"Diese Person ist bereits beigetreten. Wähle einen anderen Namen oder einen neuen Spitznamen.", join_as:"Als {name} beitreten", choose_your_name:"Wähle deinen Namen", or_new_nickname:"oder als neue Person beitreten", no_names_available:"Alle aufgeführten Personen sind bereits beigetreten. Verwende einen neuen Spitznamen.", new_nickname:"Neuer Spitzname", new_nickname_hint:"Nur verwenden, wenn du noch nicht in der Liste stehst.", join_as_new:"Als neue Person beitreten",
  pending:"Ausstehend", history:"Verlauf", mark_as_paid:"Als bezahlt markieren", paid:"zahlte an", paid_on:"Bezahlt am {date}", paid_via:"über {name}", confirm_payment:"Zahlung bestätigen", confirm_payment_desc:"Dadurch werden die Salden aktualisiert und die Zahlung in den Verlauf verschoben.", confirm_paid:"Als bezahlt bestätigen", no_payment_history:"Noch kein Zahlungsverlauf", no_payment_history_desc:"Bestätigte Zahlungen erscheinen hier.",
};

Object.assign(en, {
  hero_title: "Trips feel better when money stays simple.",
  landing_stories: "Shared trip stories",
  previous_story: "Previous story", next_story: "Next story", choose_story: "Choose a travel story", show_story: "Show story",
  landing_slide_restaurant_title: "One bill, four friends.", landing_slide_restaurant_desc: "Assign every item in a few taps.", landing_slide_restaurant_alt: "Friends splitting a restaurant receipt beside a lake",
  landing_slide_villa_title: "Every room, already sorted.", landing_slide_villa_desc: "Price the stay and split by room or guest.", landing_slide_villa_alt: "Friends assigning rooms outside a Mediterranean villa",
  landing_slide_road_title: "The road trip stays fair.", landing_slide_road_desc: "Track the rental, seats and who drove.", landing_slide_road_alt: "Friends planning a coastal road trip beside their rental car",
  landing_core_features: "Core HolidaySplits features",
  proof_scan_title: "Scan any receipt", proof_scan_desc: "Photograph the bill, review the items, then choose who shared each one.",
  proof_split_title: "Split any cost", proof_split_desc: "Use equal shares, rooms or exact amounts for a flexible, fair split.",
  proof_currency_title: "Travel in any currency", proof_currency_desc: "Record locally, convert consistently and settle in the currency you prefer.",
  landing_how_title: "Built for the whole trip.", landing_how_desc: "From the first booking to the final coffee, keep every shared decision and cost in one calm place.",
  how_group_title: "Bring the group", how_group_desc: "Create a local trip, join without an account or share a connected room.",
  how_spend_title: "Capture the spend", how_spend_desc: "Type it, scan it or use dedicated splits for restaurants, stays and transport.",
  how_even_title: "Leave even", how_even_desc: "Reduce the final balance to a few clear payments and mark them paid.",
  landing_footer: "Plan together, split fairly and keep the best part of the trip between friends.",
  footer_explore: "Explore", footer_follow: "Follow along", footer_soon: "Coming soon", footer_made_for: "Made for shared adventures.",
});

Object.assign(ro, {
  landing_stories: "Povești din călătorii",
  previous_story: "Povestea anterioară", next_story: "Povestea următoare", choose_story: "Alege o poveste de călătorie", show_story: "Arată povestea",
  landing_slide_restaurant_title: "O notă, patru prieteni.", landing_slide_restaurant_desc: "Atribuie fiecare articol din câteva atingeri.", landing_slide_restaurant_alt: "Prieteni care împart nota la un restaurant lângă lac",
  landing_slide_villa_title: "Fiecare cameră, deja stabilită.", landing_slide_villa_desc: "Adaugă prețul cazării și împarte pe cameră sau oaspete.", landing_slide_villa_alt: "Prieteni care aleg camerele unei vile mediteraneene",
  landing_slide_road_title: "Drumul rămâne echitabil.", landing_slide_road_desc: "Urmărește închirierea, locurile și cine a condus.", landing_slide_road_alt: "Prieteni care planifică un drum pe coastă lângă mașina închiriată",
  landing_core_features: "Funcțiile principale HolidaySplits",
  proof_scan_title: "Scanează orice bon", proof_scan_desc: "Fotografiază nota, verifică articolele și alege cine a împărțit fiecare lucru.",
  proof_split_title: "Împarte orice cost", proof_split_desc: "Folosește părți egale, camere sau sume exacte pentru o împărțire corectă.",
  proof_currency_title: "Călătorește în orice monedă", proof_currency_desc: "Înregistrează local, convertește consecvent și decontează în moneda preferată.",
  landing_how_title: "Creat pentru toată călătoria.", landing_how_desc: "De la prima rezervare la ultima cafea, păstrează toate costurile comune într-un singur loc.",
  how_group_title: "Adună grupul", how_group_desc: "Creează o excursie locală, intră fără cont sau distribuie o cameră conectată.",
  how_spend_title: "Înregistrează cheltuielile", how_spend_desc: "Scrie, scanează sau folosește împărțirile pentru restaurante, cazare și transport.",
  how_even_title: "Plecați fără datorii", how_even_desc: "Reduce soldul final la câteva plăți clare și marchează-le ca plătite.",
  landing_footer: "Planificați împreună, împărțiți corect și păstrați partea frumoasă între prieteni.",
  footer_explore: "Explorează", footer_follow: "Urmărește-ne", footer_soon: "În curând", footer_made_for: "Creat pentru aventuri împărtășite.",
});

Object.assign(es, {
  landing_stories: "Historias de viaje compartidas",
  previous_story: "Historia anterior", next_story: "Historia siguiente", choose_story: "Elige una historia de viaje", show_story: "Mostrar historia",
  landing_slide_restaurant_title: "Una cuenta, cuatro amigos.", landing_slide_restaurant_desc: "Asigna cada artículo con unos toques.", landing_slide_restaurant_alt: "Amigos dividiendo una cuenta junto a un lago",
  landing_slide_villa_title: "Cada habitación, ya resuelta.", landing_slide_villa_desc: "Añade la estancia y divide por habitación o huésped.", landing_slide_villa_alt: "Amigos asignando habitaciones en una villa mediterránea",
  landing_slide_road_title: "La ruta sigue siendo justa.", landing_slide_road_desc: "Registra el alquiler, las plazas y quién condujo.", landing_slide_road_alt: "Amigos planificando una ruta costera junto a su coche de alquiler",
  landing_core_features: "Funciones principales de HolidaySplits",
  proof_scan_title: "Escanea cualquier recibo", proof_scan_desc: "Fotografía la cuenta, revisa los artículos y elige quién compartió cada uno.",
  proof_split_title: "Divide cualquier coste", proof_split_desc: "Usa partes iguales, habitaciones o importes exactos para un reparto justo.",
  proof_currency_title: "Viaja en cualquier moneda", proof_currency_desc: "Registra, convierte de forma coherente y salda en la moneda que prefieras.",
  landing_how_title: "Creado para todo el viaje.", landing_how_desc: "Desde la primera reserva hasta el último café, guarda cada coste compartido en un lugar tranquilo.",
  how_group_title: "Reúne al grupo", how_group_desc: "Crea un viaje local, entra sin cuenta o comparte una sala conectada.",
  how_spend_title: "Registra el gasto", how_spend_desc: "Escríbelo, escanéalo o usa repartos para restaurantes, estancias y transporte.",
  how_even_title: "Termina en paz", how_even_desc: "Reduce el saldo final a unos pocos pagos claros y márcalos como pagados.",
  landing_footer: "Planificad juntos, repartid con justicia y quedaos con lo mejor del viaje.",
  footer_explore: "Explorar", footer_follow: "Síguenos", footer_soon: "Próximamente", footer_made_for: "Hecho para aventuras compartidas.",
});

Object.assign(fr, {
  landing_stories: "Histoires de voyage partagées",
  previous_story: "Histoire précédente", next_story: "Histoire suivante", choose_story: "Choisir une histoire de voyage", show_story: "Afficher l’histoire",
  landing_slide_restaurant_title: "Une addition, quatre amis.", landing_slide_restaurant_desc: "Attribuez chaque article en quelques gestes.", landing_slide_restaurant_alt: "Des amis partagent une addition au bord d’un lac",
  landing_slide_villa_title: "Chaque chambre est déjà réglée.", landing_slide_villa_desc: "Ajoutez le séjour et partagez par chambre ou invité.", landing_slide_villa_alt: "Des amis attribuent les chambres d’une villa méditerranéenne",
  landing_slide_road_title: "Le road trip reste équitable.", landing_slide_road_desc: "Suivez la location, les places et les conducteurs.", landing_slide_road_alt: "Des amis préparent un trajet côtier près de leur voiture de location",
  landing_core_features: "Fonctions principales de HolidaySplits",
  proof_scan_title: "Scannez chaque reçu", proof_scan_desc: "Photographiez l’addition, vérifiez les articles et choisissez qui a partagé chacun.",
  proof_split_title: "Partagez chaque coût", proof_split_desc: "Parts égales, chambres ou montants exacts : choisissez un partage juste.",
  proof_currency_title: "Voyagez dans toute devise", proof_currency_desc: "Enregistrez, convertissez avec cohérence et réglez dans la devise choisie.",
  landing_how_title: "Conçu pour tout le voyage.", landing_how_desc: "De la première réservation au dernier café, gardez chaque coût partagé au même endroit.",
  how_group_title: "Réunissez le groupe", how_group_desc: "Créez un voyage local, rejoignez sans compte ou partagez un salon connecté.",
  how_spend_title: "Saisissez les dépenses", how_spend_desc: "Tapez, scannez ou utilisez les partages dédiés aux restaurants, séjours et transports.",
  how_even_title: "Partez quittes", how_even_desc: "Réduisez le solde final à quelques paiements clairs et marquez-les comme payés.",
  landing_footer: "Planifiez ensemble, partagez équitablement et gardez le meilleur du voyage entre amis.",
  footer_explore: "Explorer", footer_follow: "Suivez-nous", footer_soon: "Bientôt", footer_made_for: "Conçu pour les aventures partagées.",
});

Object.assign(de, {
  landing_stories: "Gemeinsame Reisegeschichten",
  previous_story: "Vorherige Geschichte", next_story: "Nächste Geschichte", choose_story: "Reisegeschichte auswählen", show_story: "Geschichte anzeigen",
  landing_slide_restaurant_title: "Eine Rechnung, vier Freunde.", landing_slide_restaurant_desc: "Ordne jeden Posten mit wenigen Klicks zu.", landing_slide_restaurant_alt: "Freunde teilen eine Restaurantrechnung an einem See",
  landing_slide_villa_title: "Jedes Zimmer ist schon geklärt.", landing_slide_villa_desc: "Erfasse den Aufenthalt und teile nach Zimmer oder Gast.", landing_slide_villa_alt: "Freunde verteilen Zimmer in einer mediterranen Villa",
  landing_slide_road_title: "Der Roadtrip bleibt fair.", landing_slide_road_desc: "Erfasse Miete, Sitzplätze und wer gefahren ist.", landing_slide_road_alt: "Freunde planen eine Küstenfahrt neben ihrem Mietwagen",
  landing_core_features: "Die wichtigsten HolidaySplits-Funktionen",
  proof_scan_title: "Jeden Beleg scannen", proof_scan_desc: "Fotografiere die Rechnung, prüfe die Posten und wähle, wer was geteilt hat.",
  proof_split_title: "Jede Ausgabe teilen", proof_split_desc: "Nutze gleiche Anteile, Zimmer oder genaue Beträge für eine faire Aufteilung.",
  proof_currency_title: "In jeder Währung reisen", proof_currency_desc: "Erfasse lokal, rechne einheitlich um und gleiche in deiner Währung aus.",
  landing_how_title: "Für die ganze Reise gemacht.", landing_how_desc: "Von der ersten Buchung bis zum letzten Kaffee bleiben alle gemeinsamen Kosten an einem Ort.",
  how_group_title: "Gruppe zusammenbringen", how_group_desc: "Erstelle eine lokale Reise, tritt ohne Konto bei oder teile einen verbundenen Raum.",
  how_spend_title: "Ausgaben erfassen", how_spend_desc: "Tippe, scanne oder nutze eigene Aufteilungen für Restaurants, Unterkünfte und Transport.",
  how_even_title: "Ausgeglichen abreisen", how_even_desc: "Reduziere den Endsaldo auf wenige klare Zahlungen und markiere sie als bezahlt.",
  landing_footer: "Gemeinsam planen, fair teilen und den schönsten Teil der Reise unter Freunden genießen.",
  footer_explore: "Entdecken", footer_follow: "Folge uns", footer_soon: "Demnächst", footer_made_for: "Für gemeinsame Abenteuer gemacht.",
});

Object.assign(en, {
  group_choice: "Choose together", group_decisions: "Group decisions", group_decisions_desc: "Compare the real options, vote once, and see what the group prefers before anyone books.",
  open_votes: "Open votes", new_vote: "New vote", voting_as: "Voting as", no_people: "No people", one_vote_help: "Each person gets one vote and can change it until the decision is closed.", add_people_to_vote: "Add at least one person before creating a vote.",
  vote_category: "Vote category", poll_category_accommodation: "Accommodation", poll_category_rental_car: "Rental car", poll_category_flight: "Flight", poll_category_restaurant: "Restaurant", poll_category_activity: "Activity", poll_category_other: "Anything else",
  poll_question: "What are we deciding?", poll_question_placeholder: "Which option should we choose?", poll_choices: "Choices", choice: "Choice", choice_title_placeholder: "Option name", details_optional: "Details · optional", choice_detail_placeholder: "Dates, location or useful details", optional_price: "Price · optional", optional_link: "Link · optional", add_choice: "Add another choice", create_vote: "Start voting",
  poll_open: "Open", poll_closed: "Closed", poll_vote_count: "Votes: {count}", people_voted: "People voted: {count}", leading: "Leading", tied: "Tied", winner: "Winner", view_option: "View", started_by: "Started by {name}", close_vote: "Close", reopen_vote: "Reopen", delete_vote: "Delete", delete_poll_confirm: "Delete this vote and all of its results?", no_votes: "No decisions yet", no_votes_desc: "Start with two options for a stay, rental car, flight, restaurant, activity, or anything else.", vote_on_this: "Vote on this", choose_accommodation_vote: "Which accommodation should we choose?", choose_rental_vote: "Which rental car should we choose?", choose_flight_vote: "Which flight should we choose?",
});

Object.assign(ro, {
  group_choice: "Alegeți împreună", group_decisions: "Deciziile grupului", group_decisions_desc: "Comparați opțiunile reale, votați o singură dată și vedeți ce preferă grupul înainte de rezervare.",
  open_votes: "Voturi deschise", new_vote: "Vot nou", voting_as: "Votează ca", no_people: "Nicio persoană", one_vote_help: "Fiecare persoană are un vot și îl poate schimba până la închiderea deciziei.", add_people_to_vote: "Adaugă cel puțin o persoană înainte de a crea un vot.",
  vote_category: "Categoria votului", poll_category_accommodation: "Cazare", poll_category_rental_car: "Mașină închiriată", poll_category_flight: "Zbor", poll_category_restaurant: "Restaurant", poll_category_activity: "Activitate", poll_category_other: "Orice altceva",
  poll_question: "Ce decidem?", poll_question_placeholder: "Ce opțiune alegem?", poll_choices: "Opțiuni", choice: "Opțiune", choice_title_placeholder: "Numele opțiunii", details_optional: "Detalii · opțional", choice_detail_placeholder: "Date, locație sau detalii utile", optional_price: "Preț · opțional", optional_link: "Link · opțional", add_choice: "Adaugă altă opțiune", create_vote: "Începe votul",
  poll_open: "Deschis", poll_closed: "Închis", poll_vote_count: "Voturi: {count}", people_voted: "Au votat: {count}", leading: "Pe primul loc", tied: "Egalitate", winner: "Câștigător", view_option: "Vezi", started_by: "Creat de {name}", close_vote: "Închide", reopen_vote: "Redeschide", delete_vote: "Șterge", delete_poll_confirm: "Ștergi acest vot și toate rezultatele lui?", no_votes: "Nicio decizie încă", no_votes_desc: "Începe cu două opțiuni pentru cazare, mașină închiriată, zbor, restaurant, activitate sau orice altceva.", vote_on_this: "Votează această opțiune", choose_accommodation_vote: "Ce cazare alegem?", choose_rental_vote: "Ce mașină închiriată alegem?", choose_flight_vote: "Ce zbor alegem?",
});

Object.assign(es, {
  group_choice: "Elegid juntos", group_decisions: "Decisiones del grupo", group_decisions_desc: "Comparad las opciones reales, votad una vez y ved qué prefiere el grupo antes de reservar.",
  open_votes: "Votaciones abiertas", new_vote: "Nueva votación", voting_as: "Votar como", no_people: "Sin personas", one_vote_help: "Cada persona tiene un voto y puede cambiarlo hasta que se cierre la decisión.", add_people_to_vote: "Añade al menos una persona antes de crear una votación.",
  vote_category: "Categoría", poll_category_accommodation: "Alojamiento", poll_category_rental_car: "Coche de alquiler", poll_category_flight: "Vuelo", poll_category_restaurant: "Restaurante", poll_category_activity: "Actividad", poll_category_other: "Cualquier otra cosa",
  poll_question: "¿Qué estamos decidiendo?", poll_question_placeholder: "¿Qué opción elegimos?", poll_choices: "Opciones", choice: "Opción", choice_title_placeholder: "Nombre de la opción", details_optional: "Detalles · opcional", choice_detail_placeholder: "Fechas, ubicación o detalles útiles", optional_price: "Precio · opcional", optional_link: "Enlace · opcional", add_choice: "Añadir otra opción", create_vote: "Empezar votación",
  poll_open: "Abierta", poll_closed: "Cerrada", poll_vote_count: "Votos: {count}", people_voted: "Han votado: {count}", leading: "En cabeza", tied: "Empate", winner: "Ganadora", view_option: "Ver", started_by: "Creada por {name}", close_vote: "Cerrar", reopen_vote: "Reabrir", delete_vote: "Eliminar", delete_poll_confirm: "¿Eliminar esta votación y todos sus resultados?", no_votes: "Aún no hay decisiones", no_votes_desc: "Empieza con dos opciones de alojamiento, coche de alquiler, vuelo, restaurante, actividad o cualquier otra cosa.", vote_on_this: "Votar esta opción", choose_accommodation_vote: "¿Qué alojamiento elegimos?", choose_rental_vote: "¿Qué coche de alquiler elegimos?", choose_flight_vote: "¿Qué vuelo elegimos?",
});

Object.assign(fr, {
  group_choice: "Choisissez ensemble", group_decisions: "Décisions du groupe", group_decisions_desc: "Comparez les vraies options, votez une fois et voyez la préférence du groupe avant de réserver.",
  open_votes: "Votes ouverts", new_vote: "Nouveau vote", voting_as: "Voter en tant que", no_people: "Aucune personne", one_vote_help: "Chaque personne dispose d’un vote et peut le modifier jusqu’à la clôture de la décision.", add_people_to_vote: "Ajoutez au moins une personne avant de créer un vote.",
  vote_category: "Catégorie du vote", poll_category_accommodation: "Hébergement", poll_category_rental_car: "Voiture de location", poll_category_flight: "Vol", poll_category_restaurant: "Restaurant", poll_category_activity: "Activité", poll_category_other: "Autre chose",
  poll_question: "Que décidons-nous ?", poll_question_placeholder: "Quelle option choisissons-nous ?", poll_choices: "Choix", choice: "Choix", choice_title_placeholder: "Nom de l’option", details_optional: "Détails · facultatif", choice_detail_placeholder: "Dates, lieu ou détails utiles", optional_price: "Prix · facultatif", optional_link: "Lien · facultatif", add_choice: "Ajouter un choix", create_vote: "Lancer le vote",
  poll_open: "Ouvert", poll_closed: "Fermé", poll_vote_count: "Votes : {count}", people_voted: "Participants : {count}", leading: "En tête", tied: "Égalité", winner: "Gagnant", view_option: "Voir", started_by: "Créé par {name}", close_vote: "Clore", reopen_vote: "Rouvrir", delete_vote: "Supprimer", delete_poll_confirm: "Supprimer ce vote et tous ses résultats ?", no_votes: "Aucune décision", no_votes_desc: "Commencez avec deux options d’hébergement, voiture de location, vol, restaurant, activité ou toute autre idée.", vote_on_this: "Soumettre au vote", choose_accommodation_vote: "Quel hébergement choisissons-nous ?", choose_rental_vote: "Quelle voiture de location choisissons-nous ?", choose_flight_vote: "Quel vol choisissons-nous ?",
});

Object.assign(de, {
  group_choice: "Gemeinsam entscheiden", group_decisions: "Gruppenentscheidungen", group_decisions_desc: "Vergleicht die echten Optionen, stimmt einmal ab und seht vor der Buchung, was die Gruppe bevorzugt.",
  open_votes: "Offene Abstimmungen", new_vote: "Neue Abstimmung", voting_as: "Abstimmen als", no_people: "Keine Personen", one_vote_help: "Jede Person hat eine Stimme und kann sie bis zum Schließen der Entscheidung ändern.", add_people_to_vote: "Füge mindestens eine Person hinzu, bevor du eine Abstimmung erstellst.",
  vote_category: "Kategorie", poll_category_accommodation: "Unterkunft", poll_category_rental_car: "Mietwagen", poll_category_flight: "Flug", poll_category_restaurant: "Restaurant", poll_category_activity: "Aktivität", poll_category_other: "Etwas anderes",
  poll_question: "Was entscheiden wir?", poll_question_placeholder: "Welche Option wählen wir?", poll_choices: "Optionen", choice: "Option", choice_title_placeholder: "Name der Option", details_optional: "Details · optional", choice_detail_placeholder: "Daten, Ort oder nützliche Details", optional_price: "Preis · optional", optional_link: "Link · optional", add_choice: "Weitere Option", create_vote: "Abstimmung starten",
  poll_open: "Offen", poll_closed: "Geschlossen", poll_vote_count: "Stimmen: {count}", people_voted: "Abgestimmt: {count}", leading: "Führt", tied: "Gleichstand", winner: "Gewinner", view_option: "Ansehen", started_by: "Erstellt von {name}", close_vote: "Schließen", reopen_vote: "Wieder öffnen", delete_vote: "Löschen", delete_poll_confirm: "Diese Abstimmung und alle Ergebnisse löschen?", no_votes: "Noch keine Entscheidung", no_votes_desc: "Starte mit zwei Optionen für Unterkunft, Mietwagen, Flug, Restaurant, Aktivität oder etwas anderes.", vote_on_this: "Darüber abstimmen", choose_accommodation_vote: "Welche Unterkunft wählen wir?", choose_rental_vote: "Welchen Mietwagen wählen wir?", choose_flight_vote: "Welchen Flug wählen wir?",
});

Object.assign(en, {
  checking_session: "Checking your session…", my_trips: "My trips", profile: "Profile", sign_out: "Sign out",
  your_profile: "Your profile.", profile_desc: "Keep your account details current and control how you sign in to HolidaySplits.", signed_in_as: "Signed in as",
  personal_details: "Personal details", personal_details_desc: "This is the name your travel groups will see.", display_name: "Display name", email_address: "Email address", save_profile: "Save profile", profile_saved: "Your profile was updated.", saving: "Saving…",
  password_security: "Password & security", password_security_desc: "Use your current password to choose a new one, or request a secure link by email.", current_password: "Current password", new_password: "New password", confirm_new_password: "Confirm new password", change_password: "Change password", set_new_password: "Set new password", password_updated: "Your password was updated.", password_mismatch: "The new passwords do not match.", password_minimum: "Use at least 8 characters.", email_reset_link: "Email me a reset link", reset_link_sent: "We sent a password reset link to your email.", sending: "Sending…", updating: "Updating…",
  recovery_title: "Choose a new password", recovery_desc: "Your reset link is verified. Set a new password to finish recovering your account.",
  danger_zone: "Danger zone", delete_account: "Delete account", delete_account_desc: "Permanently remove your login and private profile. Trips are handed to another admin when possible, while shared expense history stays intact.", delete_account_confirm_title: "Delete your account?", delete_account_confirm_desc: "This is permanent. Your existing shared trip entries remain so group balances stay correct. Confirm with your current password.", confirm_with_password: "Current password", enter_password_to_delete: "Enter your password", delete_forever: "Delete forever", deleting: "Deleting…",
  online_mode: "Online mode", register: "Register", continue_google: "Continue with Google", or: "or", your_name: "Your name", password: "Password", forgot_password: "Forgot password?", forgot_password_desc: "Enter your account email and we’ll send a secure link to choose a new password.", password_placeholder: "Min. 6 characters", please_wait: "Please wait…", send_reset_link: "Send reset link", create_account: "Create account", back_to_sign_in: "Back to sign in", reset_link_sent_generic: "If an account exists for this email, a reset link is on its way.", confirm_email_message: "Check your inbox to confirm your email, then sign in.", account_sync_note: "Secure account mode keeps your shared rooms available across devices.",
});

Object.assign(ro, {
  checking_session: "Verificăm sesiunea…", my_trips: "Călătoriile mele", profile: "Profil", sign_out: "Deconectare",
  your_profile: "Profilul tău.", profile_desc: "Actualizează datele contului și controlează modul în care te conectezi la HolidaySplits.", signed_in_as: "Conectat ca",
  personal_details: "Date personale", personal_details_desc: "Acesta este numele pe care îl vor vedea grupurile tale.", display_name: "Nume afișat", email_address: "Adresă de email", save_profile: "Salvează profilul", profile_saved: "Profilul a fost actualizat.", saving: "Se salvează…",
  password_security: "Parolă și securitate", password_security_desc: "Folosește parola actuală pentru a alege una nouă sau cere un link securizat prin email.", current_password: "Parola actuală", new_password: "Parolă nouă", confirm_new_password: "Confirmă parola nouă", change_password: "Schimbă parola", set_new_password: "Setează parola nouă", password_updated: "Parola a fost actualizată.", password_mismatch: "Parolele noi nu coincid.", password_minimum: "Folosește cel puțin 8 caractere.", email_reset_link: "Trimite-mi un link de resetare", reset_link_sent: "Am trimis linkul de resetare pe email.", sending: "Se trimite…", updating: "Se actualizează…",
  recovery_title: "Alege o parolă nouă", recovery_desc: "Linkul de resetare este verificat. Setează o parolă nouă pentru a recupera contul.",
  danger_zone: "Zonă periculoasă", delete_account: "Șterge contul", delete_account_desc: "Șterge definitiv autentificarea și profilul privat. Călătoriile sunt preluate de alt administrator când este posibil, iar istoricul cheltuielilor rămâne corect.", delete_account_confirm_title: "Ștergi contul?", delete_account_confirm_desc: "Acțiunea este permanentă. Intrările existente din călătoriile comune rămân pentru a păstra soldurile corecte. Confirmă cu parola actuală.", confirm_with_password: "Parola actuală", enter_password_to_delete: "Introdu parola", delete_forever: "Șterge definitiv", deleting: "Se șterge…",
  online_mode: "Mod online", register: "Înregistrare", continue_google: "Continuă cu Google", or: "sau", your_name: "Numele tău", password: "Parolă", forgot_password: "Ai uitat parola?", forgot_password_desc: "Introdu emailul contului și îți vom trimite un link securizat pentru o parolă nouă.", password_placeholder: "Min. 6 caractere", please_wait: "Te rugăm să aștepți…", send_reset_link: "Trimite linkul", create_account: "Creează cont", back_to_sign_in: "Înapoi la conectare", reset_link_sent_generic: "Dacă există un cont pentru acest email, linkul de resetare este pe drum.", confirm_email_message: "Verifică emailul pentru confirmare, apoi conectează-te.", account_sync_note: "Modul cu cont păstrează camerele comune disponibile pe toate dispozitivele.",
});

Object.assign(es, {
  checking_session: "Comprobando tu sesión…", my_trips: "Mis viajes", profile: "Perfil", sign_out: "Cerrar sesión",
  your_profile: "Tu perfil.", profile_desc: "Mantén tus datos al día y controla cómo accedes a HolidaySplits.", signed_in_as: "Sesión iniciada como",
  personal_details: "Datos personales", personal_details_desc: "Este es el nombre que verán tus grupos de viaje.", display_name: "Nombre visible", email_address: "Correo electrónico", save_profile: "Guardar perfil", profile_saved: "Tu perfil se ha actualizado.", saving: "Guardando…",
  password_security: "Contraseña y seguridad", password_security_desc: "Usa tu contraseña actual para elegir una nueva o solicita un enlace seguro por correo.", current_password: "Contraseña actual", new_password: "Nueva contraseña", confirm_new_password: "Confirmar nueva contraseña", change_password: "Cambiar contraseña", set_new_password: "Establecer nueva contraseña", password_updated: "Tu contraseña se ha actualizado.", password_mismatch: "Las nuevas contraseñas no coinciden.", password_minimum: "Usa al menos 8 caracteres.", email_reset_link: "Enviarme un enlace", reset_link_sent: "Hemos enviado el enlace de restablecimiento a tu correo.", sending: "Enviando…", updating: "Actualizando…",
  recovery_title: "Elige una nueva contraseña", recovery_desc: "Tu enlace está verificado. Define una nueva contraseña para recuperar la cuenta.",
  danger_zone: "Zona de peligro", delete_account: "Eliminar cuenta", delete_account_desc: "Elimina para siempre tu acceso y perfil privado. Los viajes pasan a otro administrador cuando sea posible y el historial de gastos se conserva.", delete_account_confirm_title: "¿Eliminar tu cuenta?", delete_account_confirm_desc: "Esta acción es permanente. Tus entradas en viajes compartidos se conservan para mantener los saldos correctos. Confirma con tu contraseña actual.", confirm_with_password: "Contraseña actual", enter_password_to_delete: "Introduce tu contraseña", delete_forever: "Eliminar para siempre", deleting: "Eliminando…",
  online_mode: "Modo online", register: "Registrarse", continue_google: "Continuar con Google", or: "o", your_name: "Tu nombre", password: "Contraseña", forgot_password: "¿Has olvidado la contraseña?", forgot_password_desc: "Introduce el correo de tu cuenta y te enviaremos un enlace seguro para elegir una nueva contraseña.", password_placeholder: "Mín. 6 caracteres", please_wait: "Espera un momento…", send_reset_link: "Enviar enlace", create_account: "Crear cuenta", back_to_sign_in: "Volver a iniciar sesión", reset_link_sent_generic: "Si existe una cuenta con este correo, el enlace de restablecimiento está en camino.", confirm_email_message: "Revisa tu correo para confirmar la cuenta y después inicia sesión.", account_sync_note: "El modo con cuenta mantiene tus salas compartidas disponibles en todos tus dispositivos.",
});

Object.assign(fr, {
  checking_session: "Vérification de votre session…", my_trips: "Mes voyages", profile: "Profil", sign_out: "Se déconnecter",
  your_profile: "Votre profil.", profile_desc: "Gardez vos informations à jour et contrôlez votre connexion à HolidaySplits.", signed_in_as: "Connecté en tant que",
  personal_details: "Informations personnelles", personal_details_desc: "C’est le nom que verront vos groupes de voyage.", display_name: "Nom affiché", email_address: "Adresse e-mail", save_profile: "Enregistrer le profil", profile_saved: "Votre profil a été mis à jour.", saving: "Enregistrement…",
  password_security: "Mot de passe et sécurité", password_security_desc: "Utilisez votre mot de passe actuel pour en choisir un nouveau ou demandez un lien sécurisé par e-mail.", current_password: "Mot de passe actuel", new_password: "Nouveau mot de passe", confirm_new_password: "Confirmer le nouveau mot de passe", change_password: "Changer le mot de passe", set_new_password: "Définir le mot de passe", password_updated: "Votre mot de passe a été mis à jour.", password_mismatch: "Les nouveaux mots de passe ne correspondent pas.", password_minimum: "Utilisez au moins 8 caractères.", email_reset_link: "M’envoyer un lien", reset_link_sent: "Le lien de réinitialisation a été envoyé par e-mail.", sending: "Envoi…", updating: "Mise à jour…",
  recovery_title: "Choisissez un nouveau mot de passe", recovery_desc: "Votre lien est vérifié. Définissez un nouveau mot de passe pour récupérer votre compte.",
  danger_zone: "Zone sensible", delete_account: "Supprimer le compte", delete_account_desc: "Supprimez définitivement votre accès et profil privé. Les voyages sont confiés à un autre administrateur si possible et l’historique des dépenses est conservé.", delete_account_confirm_title: "Supprimer votre compte ?", delete_account_confirm_desc: "Cette action est définitive. Vos entrées de voyage restent afin de préserver les soldes du groupe. Confirmez avec votre mot de passe actuel.", confirm_with_password: "Mot de passe actuel", enter_password_to_delete: "Saisissez votre mot de passe", delete_forever: "Supprimer définitivement", deleting: "Suppression…",
  online_mode: "Mode en ligne", register: "S’inscrire", continue_google: "Continuer avec Google", or: "ou", your_name: "Votre nom", password: "Mot de passe", forgot_password: "Mot de passe oublié ?", forgot_password_desc: "Saisissez l’e-mail de votre compte et nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.", password_placeholder: "6 caractères min.", please_wait: "Veuillez patienter…", send_reset_link: "Envoyer le lien", create_account: "Créer un compte", back_to_sign_in: "Retour à la connexion", reset_link_sent_generic: "Si un compte correspond à cet e-mail, le lien de réinitialisation est en route.", confirm_email_message: "Consultez votre e-mail pour confirmer votre compte, puis connectez-vous.", account_sync_note: "Le mode compte garde vos salons partagés disponibles sur tous vos appareils.",
});

Object.assign(de, {
  checking_session: "Sitzung wird geprüft…", my_trips: "Meine Reisen", profile: "Profil", sign_out: "Abmelden",
  your_profile: "Dein Profil.", profile_desc: "Halte deine Kontodaten aktuell und verwalte deine Anmeldung bei HolidaySplits.", signed_in_as: "Angemeldet als",
  personal_details: "Persönliche Angaben", personal_details_desc: "Diesen Namen sehen deine Reisegruppen.", display_name: "Anzeigename", email_address: "E-Mail-Adresse", save_profile: "Profil speichern", profile_saved: "Dein Profil wurde aktualisiert.", saving: "Speichern…",
  password_security: "Passwort und Sicherheit", password_security_desc: "Wähle mit deinem aktuellen Passwort ein neues oder fordere einen sicheren Link per E-Mail an.", current_password: "Aktuelles Passwort", new_password: "Neues Passwort", confirm_new_password: "Neues Passwort bestätigen", change_password: "Passwort ändern", set_new_password: "Neues Passwort festlegen", password_updated: "Dein Passwort wurde aktualisiert.", password_mismatch: "Die neuen Passwörter stimmen nicht überein.", password_minimum: "Verwende mindestens 8 Zeichen.", email_reset_link: "Reset-Link senden", reset_link_sent: "Wir haben den Reset-Link per E-Mail gesendet.", sending: "Senden…", updating: "Aktualisieren…",
  recovery_title: "Wähle ein neues Passwort", recovery_desc: "Dein Reset-Link wurde bestätigt. Lege ein neues Passwort fest, um dein Konto wiederherzustellen.",
  danger_zone: "Gefahrenbereich", delete_account: "Konto löschen", delete_account_desc: "Lösche Anmeldung und privates Profil dauerhaft. Reisen werden wenn möglich an einen anderen Admin übergeben; die gemeinsame Ausgabenhistorie bleibt erhalten.", delete_account_confirm_title: "Konto löschen?", delete_account_confirm_desc: "Dieser Vorgang ist endgültig. Deine bestehenden Reiseeinträge bleiben erhalten, damit Gruppensalden korrekt bleiben. Bestätige mit deinem aktuellen Passwort.", confirm_with_password: "Aktuelles Passwort", enter_password_to_delete: "Passwort eingeben", delete_forever: "Endgültig löschen", deleting: "Löschen…",
  online_mode: "Online-Modus", register: "Registrieren", continue_google: "Mit Google fortfahren", or: "oder", your_name: "Dein Name", password: "Passwort", forgot_password: "Passwort vergessen?", forgot_password_desc: "Gib die E-Mail deines Kontos ein. Wir senden dir einen sicheren Link für ein neues Passwort.", password_placeholder: "Mind. 6 Zeichen", please_wait: "Bitte warten…", send_reset_link: "Reset-Link senden", create_account: "Konto erstellen", back_to_sign_in: "Zurück zur Anmeldung", reset_link_sent_generic: "Falls ein Konto für diese E-Mail existiert, ist der Reset-Link unterwegs.", confirm_email_message: "Bestätige dein Konto über die E-Mail und melde dich danach an.", account_sync_note: "Im Kontomodus bleiben deine gemeinsamen Räume auf allen Geräten verfügbar.",
});

Object.assign(en, {
  decisions: "Decisions", open_group_chat: "Open group chat", open_chat_unread: "Open group chat, {count} unread messages", unread_messages: "{count} unread messages",
});
Object.assign(ro, {
  decisions: "Decizii", open_group_chat: "Deschide chatul grupului", open_chat_unread: "Deschide chatul grupului, {count} mesaje necitite", unread_messages: "{count} mesaje necitite",
});
Object.assign(es, {
  decisions: "Decisiones", open_group_chat: "Abrir chat del grupo", open_chat_unread: "Abrir chat del grupo, {count} mensajes sin leer", unread_messages: "{count} mensajes sin leer",
});
Object.assign(fr, {
  decisions: "Décisions", open_group_chat: "Ouvrir la discussion du groupe", open_chat_unread: "Ouvrir la discussion, {count} messages non lus", unread_messages: "{count} messages non lus",
});
Object.assign(de, {
  decisions: "Entscheidungen", open_group_chat: "Gruppenchat öffnen", open_chat_unread: "Gruppenchat öffnen, {count} ungelesene Nachrichten", unread_messages: "{count} ungelesene Nachrichten",
});

Object.assign(en, {
  member_profile: "Trip member", member_profile_desc: "Payment details and preferred ways to settle up with this person.", back_to_people: "Back to people",
  view_member_profile: "View {name}'s profile", member_not_found: "Member not found", member_not_found_desc: "This person may no longer be part of the trip.",
  payment_details: "Payment details", payment_details_desc: "Keep the information your group needs when it is time to settle up.", trip_members_only: "Trip members only",
  payment_details_ready: "Ready to receive payments from the group.", payment_details_missing: "No payment details have been added yet.", edit_payment_details: "Edit details",
  account_holder: "Account holder", iban: "IBAN", payment_methods: "Payment methods", payment_methods_help: "Add any usernames, emails, phone numbers or payment links you accept.",
  payment_method: "Payment method", payment_handle: "Payment username or link", add_payment_method: "Add payment method", payment_handle_placeholder: "Username, email, phone or payment link",
  no_payment_methods_added: "No additional payment methods yet.", payment_note: "Payment note", payment_note_placeholder: "For example: include your name and the trip in the transfer reference.",
  save_payment_details: "Save payment details", payment_details_saved: "Payment details saved.", no_payment_details: "Nothing to pay with yet",
  add_your_payment_details: "Add an IBAN or another payment method so the group knows how to pay you.", no_payment_details_desc: "This person has not shared any payment information yet.",
  add_payment_details: "Add payment details", only_member_can_edit: "Only this member can edit their claimed profile. Everyone in the trip can view these details.",
  view_payment_details: "Pay {name}", copy: "Copy", copied: "Copied",
  payment_method_revolut: "Revolut", payment_method_paypal: "PayPal", payment_method_wise: "Wise", payment_method_venmo: "Venmo", payment_method_cashapp: "Cash App",
  payment_method_bizum: "Bizum", payment_method_bank_transfer: "Bank transfer", payment_method_cash: "Cash", payment_method_other: "Other",
});
Object.assign(ro, {
  member_profile: "Membru al excursiei", member_profile_desc: "Detalii de plată și metodele preferate pentru decontarea cu această persoană.", back_to_people: "Înapoi la persoane",
  view_member_profile: "Vezi profilul lui {name}", member_not_found: "Membrul nu a fost găsit", member_not_found_desc: "Este posibil ca această persoană să nu mai facă parte din excursie.",
  payment_details: "Detalii de plată", payment_details_desc: "Păstrează informațiile de care grupul are nevoie la decontare.", trip_members_only: "Doar membrii excursiei",
  payment_details_ready: "Poate primi plăți de la grup.", payment_details_missing: "Nu au fost adăugate detalii de plată.", edit_payment_details: "Editează detaliile",
  account_holder: "Titularul contului", iban: "IBAN", payment_methods: "Metode de plată", payment_methods_help: "Adaugă utilizatorii, emailurile, numerele de telefon sau linkurile de plată acceptate.",
  payment_method: "Metodă de plată", payment_handle: "Utilizator sau link de plată", add_payment_method: "Adaugă metodă", payment_handle_placeholder: "Utilizator, email, telefon sau link de plată",
  no_payment_methods_added: "Nu există alte metode de plată.", payment_note: "Notă pentru plată", payment_note_placeholder: "De exemplu: include numele și excursia în detaliile transferului.",
  save_payment_details: "Salvează detaliile", payment_details_saved: "Detaliile de plată au fost salvate.", no_payment_details: "Încă nu există date de plată",
  add_your_payment_details: "Adaugă un IBAN sau altă metodă pentru ca grupul să știe cum să te plătească.", no_payment_details_desc: "Această persoană nu a distribuit încă informații de plată.",
  add_payment_details: "Adaugă detalii", only_member_can_edit: "Doar acest membru își poate edita profilul revendicat. Toți membrii excursiei pot vedea detaliile.",
  view_payment_details: "Plătește către {name}", copy: "Copiază", copied: "Copiat",
  payment_method_revolut: "Revolut", payment_method_paypal: "PayPal", payment_method_wise: "Wise", payment_method_venmo: "Venmo", payment_method_cashapp: "Cash App",
  payment_method_bizum: "Bizum", payment_method_bank_transfer: "Transfer bancar", payment_method_cash: "Numerar", payment_method_other: "Altă metodă",
});
Object.assign(es, {
  member_profile: "Miembro del viaje", member_profile_desc: "Datos de pago y formas preferidas de saldar cuentas con esta persona.", back_to_people: "Volver a personas",
  view_member_profile: "Ver el perfil de {name}", member_not_found: "Miembro no encontrado", member_not_found_desc: "Puede que esta persona ya no forme parte del viaje.",
  payment_details: "Datos de pago", payment_details_desc: "Guarda la información que el grupo necesita para saldar cuentas.", trip_members_only: "Solo miembros del viaje",
  payment_details_ready: "Puede recibir pagos del grupo.", payment_details_missing: "Todavía no ha añadido datos de pago.", edit_payment_details: "Editar datos",
  account_holder: "Titular de la cuenta", iban: "IBAN", payment_methods: "Métodos de pago", payment_methods_help: "Añade usuarios, correos, teléfonos o enlaces de pago que aceptes.",
  payment_method: "Método de pago", payment_handle: "Usuario o enlace de pago", add_payment_method: "Añadir método", payment_handle_placeholder: "Usuario, correo, teléfono o enlace de pago",
  no_payment_methods_added: "No hay otros métodos de pago.", payment_note: "Nota de pago", payment_note_placeholder: "Por ejemplo: incluye tu nombre y el viaje en el concepto.",
  save_payment_details: "Guardar datos", payment_details_saved: "Datos de pago guardados.", no_payment_details: "Aún no hay datos de pago",
  add_your_payment_details: "Añade un IBAN u otro método para que el grupo sepa cómo pagarte.", no_payment_details_desc: "Esta persona todavía no ha compartido información de pago.",
  add_payment_details: "Añadir datos", only_member_can_edit: "Solo este miembro puede editar su perfil reclamado. Todos los miembros del viaje pueden ver los datos.",
  view_payment_details: "Pagar a {name}", copy: "Copiar", copied: "Copiado",
  payment_method_revolut: "Revolut", payment_method_paypal: "PayPal", payment_method_wise: "Wise", payment_method_venmo: "Venmo", payment_method_cashapp: "Cash App",
  payment_method_bizum: "Bizum", payment_method_bank_transfer: "Transferencia bancaria", payment_method_cash: "Efectivo", payment_method_other: "Otro",
});
Object.assign(fr, {
  member_profile: "Membre du voyage", member_profile_desc: "Coordonnées de paiement et moyens préférés pour régler cette personne.", back_to_people: "Retour aux personnes",
  view_member_profile: "Voir le profil de {name}", member_not_found: "Membre introuvable", member_not_found_desc: "Cette personne ne fait peut-être plus partie du voyage.",
  payment_details: "Coordonnées de paiement", payment_details_desc: "Conservez les informations nécessaires au groupe pour régler les comptes.", trip_members_only: "Membres du voyage uniquement",
  payment_details_ready: "Prêt à recevoir les paiements du groupe.", payment_details_missing: "Aucune information de paiement n’a encore été ajoutée.", edit_payment_details: "Modifier",
  account_holder: "Titulaire du compte", iban: "IBAN", payment_methods: "Moyens de paiement", payment_methods_help: "Ajoutez les identifiants, e-mails, téléphones ou liens de paiement acceptés.",
  payment_method: "Moyen de paiement", payment_handle: "Identifiant ou lien de paiement", add_payment_method: "Ajouter un moyen", payment_handle_placeholder: "Identifiant, e-mail, téléphone ou lien",
  no_payment_methods_added: "Aucun autre moyen de paiement.", payment_note: "Note de paiement", payment_note_placeholder: "Par exemple : indiquez votre nom et le voyage dans la référence.",
  save_payment_details: "Enregistrer", payment_details_saved: "Coordonnées de paiement enregistrées.", no_payment_details: "Aucune donnée de paiement",
  add_your_payment_details: "Ajoutez un IBAN ou un autre moyen pour que le groupe sache comment vous payer.", no_payment_details_desc: "Cette personne n’a pas encore partagé d’informations de paiement.",
  add_payment_details: "Ajouter les coordonnées", only_member_can_edit: "Seul ce membre peut modifier son profil revendiqué. Tous les membres du voyage peuvent voir ces données.",
  view_payment_details: "Payer {name}", copy: "Copier", copied: "Copié",
  payment_method_revolut: "Revolut", payment_method_paypal: "PayPal", payment_method_wise: "Wise", payment_method_venmo: "Venmo", payment_method_cashapp: "Cash App",
  payment_method_bizum: "Bizum", payment_method_bank_transfer: "Virement bancaire", payment_method_cash: "Espèces", payment_method_other: "Autre",
});
Object.assign(de, {
  member_profile: "Reisemitglied", member_profile_desc: "Zahlungsdaten und bevorzugte Wege, diese Person zu bezahlen.", back_to_people: "Zurück zu Personen",
  view_member_profile: "Profil von {name} ansehen", member_not_found: "Mitglied nicht gefunden", member_not_found_desc: "Diese Person ist möglicherweise nicht mehr Teil der Reise.",
  payment_details: "Zahlungsdaten", payment_details_desc: "Speichere die Informationen, die die Gruppe zum Ausgleichen benötigt.", trip_members_only: "Nur für Reisemitglieder",
  payment_details_ready: "Kann Zahlungen von der Gruppe empfangen.", payment_details_missing: "Noch keine Zahlungsdaten hinzugefügt.", edit_payment_details: "Daten bearbeiten",
  account_holder: "Kontoinhaber", iban: "IBAN", payment_methods: "Zahlungsmethoden", payment_methods_help: "Füge akzeptierte Benutzernamen, E-Mails, Telefonnummern oder Zahlungslinks hinzu.",
  payment_method: "Zahlungsmethode", payment_handle: "Benutzername oder Zahlungslink", add_payment_method: "Methode hinzufügen", payment_handle_placeholder: "Benutzername, E-Mail, Telefon oder Zahlungslink",
  no_payment_methods_added: "Keine weiteren Zahlungsmethoden.", payment_note: "Zahlungshinweis", payment_note_placeholder: "Zum Beispiel: Name und Reise im Verwendungszweck angeben.",
  save_payment_details: "Zahlungsdaten speichern", payment_details_saved: "Zahlungsdaten gespeichert.", no_payment_details: "Noch keine Zahlungsdaten",
  add_your_payment_details: "Füge eine IBAN oder eine andere Methode hinzu, damit die Gruppe dich bezahlen kann.", no_payment_details_desc: "Diese Person hat noch keine Zahlungsinformationen geteilt.",
  add_payment_details: "Zahlungsdaten hinzufügen", only_member_can_edit: "Nur dieses Mitglied kann sein beanspruchtes Profil bearbeiten. Alle Reisemitglieder können die Daten sehen.",
  view_payment_details: "{name} bezahlen", copy: "Kopieren", copied: "Kopiert",
  payment_method_revolut: "Revolut", payment_method_paypal: "PayPal", payment_method_wise: "Wise", payment_method_venmo: "Venmo", payment_method_cashapp: "Cash App",
  payment_method_bizum: "Bizum", payment_method_bank_transfer: "Banküberweisung", payment_method_cash: "Barzahlung", payment_method_other: "Andere",
});

Object.assign(en, {
  open_guest_room: "Create or join a room",
  no_account_choice: "Local trips stay on this device. Shared rooms require a free account.",
  account_required_for_room: "An account is required for shared rooms.",
  room_ready_after_sign_in: "Create an account or sign in to continue to room {code}.",
});
Object.assign(ro, {
  open_guest_room: "Creează sau intră într-o cameră",
  no_account_choice: "Excursiile locale rămân pe acest dispozitiv. Camerele partajate necesită un cont gratuit.",
  account_required_for_room: "Pentru camerele partajate este necesar un cont.",
  room_ready_after_sign_in: "Creează un cont sau autentifică-te pentru a continua în camera {code}.",
});
Object.assign(es, {
  open_guest_room: "Crear o unirse a una sala",
  no_account_choice: "Los viajes locales permanecen en este dispositivo. Las salas compartidas requieren una cuenta gratuita.",
  account_required_for_room: "Se necesita una cuenta para las salas compartidas.",
  room_ready_after_sign_in: "Crea una cuenta o inicia sesión para continuar a la sala {code}.",
});
Object.assign(fr, {
  open_guest_room: "Créer ou rejoindre un salon",
  no_account_choice: "Les voyages locaux restent sur cet appareil. Les salons partagés nécessitent un compte gratuit.",
  account_required_for_room: "Un compte est requis pour les salons partagés.",
  room_ready_after_sign_in: "Créez un compte ou connectez-vous pour accéder au salon {code}.",
});
Object.assign(de, {
  open_guest_room: "Raum erstellen oder beitreten",
  no_account_choice: "Lokale Reisen bleiben auf diesem Gerät. Geteilte Räume erfordern ein kostenloses Konto.",
  account_required_for_room: "Für geteilte Räume ist ein Konto erforderlich.",
  room_ready_after_sign_in: "Erstelle ein Konto oder melde dich an, um Raum {code} zu öffnen.",
});

Object.assign(en, {
  invite_friend: "Invite",
  tutorial_title: "Your trip, sorted in 60 seconds.",
  tutorial_desc: "Open the quick guide and see how a room goes from invite to settled.",
  tutorial_open: "Open the quick guide", tutorial_close: "Close the quick guide",
  tutorial_create_title: "Create the room", tutorial_create_desc: "Create an account, name the trip and add the people who may share costs. The creator starts as admin.",
  tutorial_invite_title: "Share one invite", tutorial_invite_desc: "Copy the invitation link from the trip. Friends create an account or sign in, and the room code is already waiting in the join box.",
  tutorial_spend_title: "Add what everyone spent", tutorial_spend_desc: "Record a normal expense, scan a bill or use the dedicated restaurant, stay, car and flight splits.",
  tutorial_settle_title: "Settle without the awkwardness", tutorial_settle_desc: "HolidaySplits reduces the balances to clear payments. Confirm each payment and keep the history together.",
  tutorial_invite_link: "Invite link", tutorial_copy_link: "Copy link",
  social_instagram_alt: "Friends planning a shared trip on a Mediterranean terrace",
  social_tiktok_alt: "Friends planning a coastal road trip beside their rental car",
  how_group_desc: "Create a local trip or share an account-protected room with one invitation link.",
});
Object.assign(ro, {
  invite_friend: "Invită",
  tutorial_title: "Excursia ta, organizată în 60 de secunde.",
  tutorial_desc: "Deschide ghidul rapid și vezi cum ajunge o cameră de la invitație la decontare.",
  tutorial_open: "Deschide ghidul rapid", tutorial_close: "Închide ghidul rapid",
  tutorial_create_title: "Creează camera", tutorial_create_desc: "Creează un cont, denumește excursia și adaugă persoanele care vor împărți costurile. Creatorul devine administrator.",
  tutorial_invite_title: "Trimite o singură invitație", tutorial_invite_desc: "Copiază linkul invitației din excursie. Prietenii își creează un cont sau se autentifică, iar codul camerei îi așteaptă deja în câmpul de alăturare.",
  tutorial_spend_title: "Adaugă ce a plătit fiecare", tutorial_spend_desc: "Înregistrează o cheltuială, scanează un bon sau folosește împărțirile pentru restaurant, cazare, mașină și zbor.",
  tutorial_settle_title: "Decontează fără momente stânjenitoare", tutorial_settle_desc: "HolidaySplits reduce soldurile la plăți clare. Confirmă fiecare plată și păstrează istoricul într-un singur loc.",
  tutorial_invite_link: "Link de invitație", tutorial_copy_link: "Copiază linkul",
  social_instagram_alt: "Prieteni care planifică o excursie comună pe o terasă mediteraneeană",
  social_tiktok_alt: "Prieteni care planifică un drum pe coastă lângă mașina închiriată",
  how_group_desc: "Creează o excursie locală sau distribuie o cameră protejată prin cont cu un singur link.",
});
Object.assign(es, {
  invite_friend: "Invitar",
  tutorial_title: "Tu viaje, organizado en 60 segundos.",
  tutorial_desc: "Abre la guía rápida y descubre cómo una sala pasa de la invitación a las cuentas saldadas.",
  tutorial_open: "Abrir la guía rápida", tutorial_close: "Cerrar la guía rápida",
  tutorial_create_title: "Crea la sala", tutorial_create_desc: "Crea una cuenta, pon nombre al viaje y añade a quienes compartirán gastos. La persona creadora empieza como administradora.",
  tutorial_invite_title: "Comparte una invitación", tutorial_invite_desc: "Copia el enlace desde el viaje. Tus amigos crean una cuenta o inician sesión y el código ya aparece en el campo para unirse.",
  tutorial_spend_title: "Añade lo que pagó cada persona", tutorial_spend_desc: "Registra un gasto, escanea un recibo o usa los repartos de restaurante, alojamiento, coche y vuelo.",
  tutorial_settle_title: "Salda sin momentos incómodos", tutorial_settle_desc: "HolidaySplits reduce los saldos a pagos claros. Confirma cada pago y conserva el historial en un solo lugar.",
  tutorial_invite_link: "Enlace de invitación", tutorial_copy_link: "Copiar enlace",
  social_instagram_alt: "Amigos planificando un viaje compartido en una terraza mediterránea",
  social_tiktok_alt: "Amigos planificando una ruta costera junto a su coche de alquiler",
  how_group_desc: "Crea un viaje local o comparte una sala protegida por cuenta con un solo enlace.",
});
Object.assign(fr, {
  invite_friend: "Inviter",
  tutorial_title: "Votre voyage, organisé en 60 secondes.",
  tutorial_desc: "Ouvrez le guide rapide et découvrez comment un salon passe de l’invitation au règlement.",
  tutorial_open: "Ouvrir le guide rapide", tutorial_close: "Fermer le guide rapide",
  tutorial_create_title: "Créez le salon", tutorial_create_desc: "Créez un compte, nommez le voyage et ajoutez les personnes qui partageront les frais. Le créateur devient administrateur.",
  tutorial_invite_title: "Partagez une invitation", tutorial_invite_desc: "Copiez le lien depuis le voyage. Vos amis créent un compte ou se connectent et le code est déjà présent dans le champ pour rejoindre.",
  tutorial_spend_title: "Ajoutez ce que chacun a payé", tutorial_spend_desc: "Saisissez une dépense, scannez un reçu ou utilisez les partages dédiés au restaurant, séjour, voiture et vol.",
  tutorial_settle_title: "Réglez sans malaise", tutorial_settle_desc: "HolidaySplits réduit les soldes à des paiements clairs. Confirmez chaque paiement et conservez l’historique au même endroit.",
  tutorial_invite_link: "Lien d’invitation", tutorial_copy_link: "Copier le lien",
  social_instagram_alt: "Des amis organisent un voyage commun sur une terrasse méditerranéenne",
  social_tiktok_alt: "Des amis organisent un trajet côtier près de leur voiture de location",
  how_group_desc: "Créez un voyage local ou partagez un salon protégé par un compte avec un seul lien.",
});
Object.assign(de, {
  invite_friend: "Einladen",
  tutorial_title: "Deine Reise, in 60 Sekunden organisiert.",
  tutorial_desc: "Öffne die Kurzanleitung und sieh, wie ein Raum von der Einladung bis zum Ausgleich funktioniert.",
  tutorial_open: "Kurzanleitung öffnen", tutorial_close: "Kurzanleitung schließen",
  tutorial_create_title: "Raum erstellen", tutorial_create_desc: "Erstelle ein Konto, benenne die Reise und füge alle hinzu, die Kosten teilen. Der Ersteller beginnt als Admin.",
  tutorial_invite_title: "Eine Einladung teilen", tutorial_invite_desc: "Kopiere den Einladungslink aus der Reise. Freunde erstellen ein Konto oder melden sich an und der Raumcode steht bereits im Beitrittsfeld.",
  tutorial_spend_title: "Ausgaben aller erfassen", tutorial_spend_desc: "Erfasse eine Ausgabe, scanne einen Beleg oder nutze die Aufteilungen für Restaurant, Unterkunft, Auto und Flug.",
  tutorial_settle_title: "Ohne unangenehme Momente ausgleichen", tutorial_settle_desc: "HolidaySplits reduziert die Salden auf klare Zahlungen. Bestätige jede Zahlung und bewahre den Verlauf gemeinsam auf.",
  tutorial_invite_link: "Einladungslink", tutorial_copy_link: "Link kopieren",
  social_instagram_alt: "Freunde planen eine gemeinsame Reise auf einer mediterranen Terrasse",
  social_tiktok_alt: "Freunde planen eine Küstenfahrt neben ihrem Mietwagen",
  how_group_desc: "Erstelle eine lokale Reise oder teile einen kontogeschützten Raum mit einem einzigen Link.",
});

Object.assign(en, {
  payer: "Payer", choose_payer: "Choose payer", other_costs: "Other costs",
  other_costs_help: "Add food, activities or any other shared trip cost. Create as many as you need.",
  other_total: "Other costs total", add_other_cost: "Add other cost", title: "Title",
  other_cost_example: "Food, tickets, groceries…", other_cost: "Other cost",
  other_participants_help: "Choose everyone sharing this cost.", other_split: "Cost split",
  no_other_costs: "No other costs yet", no_other_costs_desc: "Add food or another custom shared cost.",
  others: "Others", left_to_pay: "Left to pay", pay_to: "Pay to", status: "Status",
  record_payment: "Record payment", read_only: "Read only", record_payment_for: "Record payment for {name}",
  admin_payment_note: "Only admins can record advances. Everyone else sees these values as read only.",
  cost: "Cost", choose_cost: "Choose cost", payment_amount_invalid: "Enter an amount no greater than the remaining balance.",
  advance_for: "Advance for {title}",
  planned_split_desc: "All logistics shares, advances, remaining amounts and payees in the selected currency.",
});
Object.assign(ro, {
  payer: "Plătitor", choose_payer: "Alege plătitorul", other_costs: "Alte costuri",
  other_costs_help: "Adaugă mâncare, activități sau orice alt cost comun. Poți crea oricâte ai nevoie.",
  other_total: "Total alte costuri", add_other_cost: "Adaugă alt cost", title: "Titlu",
  other_cost_example: "Mâncare, bilete, cumpărături…", other_cost: "Alt cost",
  other_participants_help: "Alege toate persoanele care împart acest cost.", other_split: "Împărțirea costului",
  no_other_costs: "Nu există alte costuri", no_other_costs_desc: "Adaugă mâncare sau un alt cost comun personalizat.",
  others: "Altele", left_to_pay: "Rămas de plată", pay_to: "De plătit către", status: "Stare",
  record_payment: "Înregistrează plata", read_only: "Doar citire", record_payment_for: "Înregistrează plata pentru {name}",
  admin_payment_note: "Doar administratorii pot înregistra avansuri. Pentru ceilalți valorile sunt doar pentru citire.",
  cost: "Cost", choose_cost: "Alege costul", payment_amount_invalid: "Introdu o sumă care nu depășește soldul rămas.",
  advance_for: "Avans pentru {title}",
  planned_split_desc: "Toate costurile logistice, avansurile, sumele rămase și destinatarii în moneda selectată.",
});
Object.assign(es, {
  payer: "Pagador", choose_payer: "Elegir pagador", other_costs: "Otros gastos",
  other_costs_help: "Añade comida, actividades o cualquier otro gasto compartido. Crea tantos como necesites.",
  other_total: "Total de otros gastos", add_other_cost: "Añadir otro gasto", title: "Título",
  other_cost_example: "Comida, entradas, compras…", other_cost: "Otro gasto",
  other_participants_help: "Elige a todas las personas que comparten este gasto.", other_split: "Reparto del gasto",
  no_other_costs: "Aún no hay otros gastos", no_other_costs_desc: "Añade comida u otro gasto compartido personalizado.",
  others: "Otros", left_to_pay: "Pendiente", pay_to: "Pagar a", status: "Estado",
  record_payment: "Registrar pago", read_only: "Solo lectura", record_payment_for: "Registrar pago de {name}",
  admin_payment_note: "Solo los administradores pueden registrar anticipos. Los demás tienen acceso de solo lectura.",
  cost: "Gasto", choose_cost: "Elegir gasto", payment_amount_invalid: "Introduce un importe que no supere el saldo pendiente.",
  advance_for: "Anticipo para {title}",
  planned_split_desc: "Todos los gastos logísticos, anticipos, saldos pendientes y destinatarios en la moneda seleccionada.",
});
Object.assign(fr, {
  payer: "Payeur", choose_payer: "Choisir le payeur", other_costs: "Autres frais",
  other_costs_help: "Ajoutez nourriture, activités ou tout autre frais partagé. Créez-en autant que nécessaire.",
  other_total: "Total des autres frais", add_other_cost: "Ajouter un autre frais", title: "Titre",
  other_cost_example: "Repas, billets, courses…", other_cost: "Autre frais",
  other_participants_help: "Choisissez toutes les personnes qui partagent ce frais.", other_split: "Partage du frais",
  no_other_costs: "Aucun autre frais", no_other_costs_desc: "Ajoutez un repas ou un autre frais partagé personnalisé.",
  others: "Autres", left_to_pay: "Reste à payer", pay_to: "Payer à", status: "Statut",
  record_payment: "Enregistrer le paiement", read_only: "Lecture seule", record_payment_for: "Enregistrer un paiement pour {name}",
  admin_payment_note: "Seuls les administrateurs peuvent enregistrer des acomptes. Les autres utilisateurs sont en lecture seule.",
  cost: "Frais", choose_cost: "Choisir le frais", payment_amount_invalid: "Saisissez un montant qui ne dépasse pas le solde restant.",
  advance_for: "Acompte pour {title}",
  planned_split_desc: "Tous les frais logistiques, acomptes, soldes restants et destinataires dans la devise choisie.",
});
Object.assign(de, {
  payer: "Zahler", choose_payer: "Zahler auswählen", other_costs: "Weitere Kosten",
  other_costs_help: "Füge Essen, Aktivitäten oder andere gemeinsame Reisekosten hinzu. Beliebig viele Einträge sind möglich.",
  other_total: "Weitere Kosten gesamt", add_other_cost: "Weitere Kosten hinzufügen", title: "Titel",
  other_cost_example: "Essen, Tickets, Einkäufe…", other_cost: "Weitere Kosten",
  other_participants_help: "Wähle alle aus, die diese Kosten teilen.", other_split: "Kostenaufteilung",
  no_other_costs: "Noch keine weiteren Kosten", no_other_costs_desc: "Füge Essen oder andere gemeinsame Kosten hinzu.",
  others: "Weitere", left_to_pay: "Noch zu zahlen", pay_to: "Zahlen an", status: "Status",
  record_payment: "Zahlung erfassen", read_only: "Nur lesen", record_payment_for: "Zahlung für {name} erfassen",
  admin_payment_note: "Nur Admins können Anzahlungen erfassen. Für alle anderen sind die Werte schreibgeschützt.",
  cost: "Kosten", choose_cost: "Kosten auswählen", payment_amount_invalid: "Gib einen Betrag ein, der den offenen Saldo nicht übersteigt.",
  advance_for: "Anzahlung für {title}",
  planned_split_desc: "Alle Logistikkosten, Anzahlungen, Restbeträge und Empfänger in der ausgewählten Währung.",
});

Object.assign(en, { member_taken: "Taken · joined member", member_placeholder: "Available placeholder", taken: "Taken", available: "Available" });
Object.assign(ro, { member_taken: "Ocupat · membru conectat", member_placeholder: "Loc disponibil", taken: "Ocupat", available: "Disponibil" });
Object.assign(es, { member_taken: "Ocupado · miembro conectado", member_placeholder: "Plaza disponible", taken: "Ocupado", available: "Disponible" });
Object.assign(fr, { member_taken: "Pris · membre connecté", member_placeholder: "Place disponible", taken: "Pris", available: "Disponible" });
Object.assign(de, { member_taken: "Belegt · verbundenes Mitglied", member_placeholder: "Verfügbarer Platz", taken: "Belegt", available: "Verfügbar" });

Object.assign(en, {
  payment_amount: "Amount paid",
  use_full_amount: "Use full amount",
  payer_or_admin_only: "Only the payer or an admin can confirm this payment.",
  confirm_payment_desc: "Enter the amount paid. A partial payment leaves the rest pending.",
});
Object.assign(ro, {
  payment_amount: "Suma plătită",
  use_full_amount: "Folosește suma integrală",
  payer_or_admin_only: "Doar plătitorul sau un administrator poate confirma această plată.",
  confirm_payment_desc: "Introdu suma plătită. Pentru o plată parțială, restul rămâne în așteptare.",
});
Object.assign(es, {
  payment_amount: "Importe pagado",
  use_full_amount: "Usar el importe completo",
  payer_or_admin_only: "Solo el pagador o un administrador puede confirmar este pago.",
  confirm_payment_desc: "Introduce el importe pagado. Si es parcial, el resto seguirá pendiente.",
});
Object.assign(fr, {
  payment_amount: "Montant payé",
  use_full_amount: "Utiliser le montant total",
  payer_or_admin_only: "Seul le payeur ou un administrateur peut confirmer ce paiement.",
  confirm_payment_desc: "Saisissez le montant payé. En cas de paiement partiel, le solde reste en attente.",
});
Object.assign(de, {
  payment_amount: "Gezahlter Betrag",
  use_full_amount: "Gesamtbetrag verwenden",
  payer_or_admin_only: "Nur der Zahler oder ein Admin kann diese Zahlung bestätigen.",
  confirm_payment_desc: "Gib den gezahlten Betrag ein. Bei einer Teilzahlung bleibt der Rest offen.",
});

Object.assign(en, {
  delete_expense: "Delete expense",
  delete_expense_confirm_title: "Delete this expense?",
  delete_expense_confirm_desc: "Delete {description}? Its shares will be removed from every balance. Settlement records that no longer apply will also be removed or reduced.",
});
Object.assign(ro, {
  delete_expense: "Șterge cheltuiala",
  delete_expense_confirm_title: "Ștergi această cheltuială?",
  delete_expense_confirm_desc: "Ștergi {description}? Partea ei va fi eliminată din toate soldurile. Plățile de decontare care nu se mai aplică vor fi eliminate sau reduse.",
});
Object.assign(es, {
  delete_expense: "Eliminar gasto",
  delete_expense_confirm_title: "¿Eliminar este gasto?",
  delete_expense_confirm_desc: "¿Eliminar {description}? Su reparto desaparecerá de todos los saldos. Los pagos que ya no correspondan también se eliminarán o reducirán.",
});
Object.assign(fr, {
  delete_expense: "Supprimer la dépense",
  delete_expense_confirm_title: "Supprimer cette dépense ?",
  delete_expense_confirm_desc: "Supprimer {description} ? Sa part sera retirée de tous les soldes. Les règlements qui ne s’appliquent plus seront également supprimés ou réduits.",
});
Object.assign(de, {
  delete_expense: "Ausgabe löschen",
  delete_expense_confirm_title: "Diese Ausgabe löschen?",
  delete_expense_confirm_desc: "{description} löschen? Ihr Anteil wird aus allen Salden entfernt. Nicht mehr zutreffende Ausgleichszahlungen werden ebenfalls entfernt oder reduziert.",
});

Object.assign(en, { go_to_landing_page: "Go to landing page" });
Object.assign(ro, { go_to_landing_page: "Mergi la pagina principală" });
Object.assign(es, { go_to_landing_page: "Ir a la página principal" });
Object.assign(fr, { go_to_landing_page: "Aller à la page d’accueil" });
Object.assign(de, { go_to_landing_page: "Zur Startseite" });

Object.assign(en, {
  sum_to_pay: "Sum to pay",
  total_left_to_settle: "Total left to settle",
  payment_reason: "Payment reason",
  choose_payment_reason: "Choose an expense",
  payment_reason_placeholder: "Rental car, accommodation, dinner…",
  payment_reason_required: "Choose what this payment is for.",
  payment_reason_history: "For: {reason}",
  confirm_payment_desc: "Choose what the payment covers, then enter the amount paid. A partial payment leaves the rest pending.",
});
Object.assign(ro, {
  sum_to_pay: "Suma de plată",
  total_left_to_settle: "Total rămas de achitat",
  payment_reason: "Motivul plății",
  choose_payment_reason: "Alege o cheltuială",
  payment_reason_placeholder: "Mașină închiriată, cazare, cină…",
  payment_reason_required: "Alege pentru ce este această plată.",
  payment_reason_history: "Pentru: {reason}",
  confirm_payment_desc: "Alege ce acoperă plata, apoi introdu suma plătită. Pentru o plată parțială, restul rămâne în așteptare.",
});
Object.assign(es, {
  sum_to_pay: "Suma a pagar",
  total_left_to_settle: "Total pendiente de saldar",
  payment_reason: "Motivo del pago",
  choose_payment_reason: "Elegir un gasto",
  payment_reason_placeholder: "Coche de alquiler, alojamiento, cena…",
  payment_reason_required: "Elige qué cubre este pago.",
  payment_reason_history: "Para: {reason}",
  confirm_payment_desc: "Elige qué cubre el pago e introduce el importe pagado. Si es parcial, el resto seguirá pendiente.",
});
Object.assign(fr, {
  sum_to_pay: "Somme à payer",
  total_left_to_settle: "Total restant à régler",
  payment_reason: "Motif du paiement",
  choose_payment_reason: "Choisir une dépense",
  payment_reason_placeholder: "Voiture de location, hébergement, dîner…",
  payment_reason_required: "Choisissez ce que couvre ce paiement.",
  payment_reason_history: "Pour : {reason}",
  confirm_payment_desc: "Choisissez ce que couvre le paiement, puis saisissez le montant payé. En cas de paiement partiel, le solde reste en attente.",
});
Object.assign(de, {
  sum_to_pay: "Zu zahlender Betrag",
  total_left_to_settle: "Noch auszugleichen",
  payment_reason: "Zahlungsgrund",
  choose_payment_reason: "Ausgabe auswählen",
  payment_reason_placeholder: "Mietwagen, Unterkunft, Abendessen…",
  payment_reason_required: "Wähle aus, wofür diese Zahlung ist.",
  payment_reason_history: "Für: {reason}",
  confirm_payment_desc: "Wähle aus, was die Zahlung abdeckt, und gib den gezahlten Betrag ein. Bei einer Teilzahlung bleibt der Rest offen.",
});

Object.assign(en, {
  edit: "Edit",
  date: "Date",
  split_label: "Split",
  scanned_receipt: "Scanned receipt",
  shared_expense: "Shared expense",
  edited: "Edited",
  custom_split: "Custom",
  person_count: "{count} person",
  people_count: "{count} people",
  edit_expense: "Edit expense",
  edit_expense_desc: "Update the cost, payer, or how it is shared. Receipt and restaurant details stay attached.",
  edit_expense_impact: "Saving recalculates group balances and adjusts settlement records that no longer apply.",
  save_changes: "Save changes",
  person_share: "{name} share",
  expense_form_required: "Add a description, a positive amount, a payer, and at least one contributor.",
  custom_shares_must_total: "Custom shares must add up to {amount}.",
});
Object.assign(ro, {
  edit: "Editează",
  date: "Dată",
  split_label: "Împărțire",
  scanned_receipt: "Bon scanat",
  shared_expense: "Cheltuială comună",
  edited: "Editată",
  custom_split: "Personalizată",
  person_count: "{count} persoană",
  people_count: "{count} persoane",
  edit_expense: "Editează cheltuiala",
  edit_expense_desc: "Actualizează costul, plătitorul sau modul de împărțire. Detaliile bonului sau restaurantului rămân atașate.",
  edit_expense_impact: "Salvarea recalculează soldurile grupului și ajustează plățile de decontare care nu se mai aplică.",
  save_changes: "Salvează modificările",
  person_share: "Partea lui {name}",
  expense_form_required: "Adaugă o descriere, o sumă pozitivă, un plătitor și cel puțin un participant.",
  custom_shares_must_total: "Sumele personalizate trebuie să însumeze {amount}.",
});
Object.assign(es, {
  edit: "Editar",
  date: "Fecha",
  split_label: "Reparto",
  scanned_receipt: "Recibo escaneado",
  shared_expense: "Gasto compartido",
  edited: "Editado",
  custom_split: "Personalizado",
  person_count: "{count} persona",
  people_count: "{count} personas",
  edit_expense: "Editar gasto",
  edit_expense_desc: "Actualiza el coste, quién pagó o cómo se reparte. Los datos del recibo o restaurante permanecen asociados.",
  edit_expense_impact: "Al guardar se recalculan los saldos y se ajustan los pagos que ya no correspondan.",
  save_changes: "Guardar cambios",
  person_share: "Parte de {name}",
  expense_form_required: "Añade una descripción, un importe positivo, quién pagó y al menos un participante.",
  custom_shares_must_total: "Los importes personalizados deben sumar {amount}.",
});
Object.assign(fr, {
  edit: "Modifier",
  date: "Date",
  split_label: "Partage",
  scanned_receipt: "Reçu scanné",
  shared_expense: "Dépense partagée",
  edited: "Modifiée",
  custom_split: "Personnalisé",
  person_count: "{count} personne",
  people_count: "{count} personnes",
  edit_expense: "Modifier la dépense",
  edit_expense_desc: "Modifiez le coût, le payeur ou le partage. Les informations du reçu ou du restaurant restent associées.",
  edit_expense_impact: "L’enregistrement recalcule les soldes et ajuste les règlements qui ne s’appliquent plus.",
  save_changes: "Enregistrer",
  person_share: "Part de {name}",
  expense_form_required: "Ajoutez une description, un montant positif, un payeur et au moins un participant.",
  custom_shares_must_total: "Les montants personnalisés doivent totaliser {amount}.",
});
Object.assign(de, {
  edit: "Bearbeiten",
  date: "Datum",
  split_label: "Aufteilung",
  scanned_receipt: "Gescannter Beleg",
  shared_expense: "Gemeinsame Ausgabe",
  edited: "Bearbeitet",
  custom_split: "Benutzerdefiniert",
  person_count: "{count} Person",
  people_count: "{count} Personen",
  edit_expense: "Ausgabe bearbeiten",
  edit_expense_desc: "Ändere Betrag, zahlende Person oder Aufteilung. Beleg- und Restaurantdetails bleiben erhalten.",
  edit_expense_impact: "Beim Speichern werden Gruppensalden neu berechnet und nicht mehr passende Ausgleichszahlungen angepasst.",
  save_changes: "Änderungen speichern",
  person_share: "Anteil von {name}",
  expense_form_required: "Füge eine Beschreibung, einen positiven Betrag, eine zahlende Person und mindestens eine beteiligte Person hinzu.",
  custom_shares_must_total: "Die eigenen Beträge müssen zusammen {amount} ergeben.",
});

Object.assign(en, {
  delete: "Delete",
  working: "Working…",
  edit_payment: "Edit payment",
  edit_payment_desc: "Admins can correct the amount or payment date. Group balances update immediately.",
  maximum_supported_payment: "Maximum supported by the balance: {amount}",
  payment_date: "Payment date and time",
  payment_edit_invalid: "Enter a valid date and an amount no greater than {amount}.",
  delete_payment_title: "Delete this payment?",
  delete_payment_desc: "The payment will be removed from history and the unpaid balance will become pending again.",
  delete_payment: "Delete payment",
  banned_identity: "Account banned · identity available",
  unclaimed_identity: "Identity not claimed",
  kick: "Kick",
  ban: "Ban",
  unban: "Unban",
  kick_member_title: "Kick {name}?",
  kick_member_desc: "Their account will immediately lose access. This identity becomes available for the correct person to claim again.",
  ban_member_title: "Ban {name}?",
  ban_member_desc: "Their account will immediately lose access and will be blocked from joining or claiming another identity in this trip.",
  unban_member_title: "Unban the account removed from {name}?",
  unban_member_desc: "The previously blocked account will be allowed to join this trip again.",
  moderation_preserves_data: "The person, expenses, assignments, and balances stay in the trip. Account payment details are cleared.",
  member_moderation_failed: "The member action could not be completed.",
});
Object.assign(ro, {
  delete: "Șterge",
  working: "Se procesează…",
  edit_payment: "Editează plata",
  edit_payment_desc: "Administratorii pot corecta suma sau data plății. Soldurile grupului se actualizează imediat.",
  maximum_supported_payment: "Maxim permis de sold: {amount}",
  payment_date: "Data și ora plății",
  payment_edit_invalid: "Introdu o dată validă și o sumă de cel mult {amount}.",
  delete_payment_title: "Ștergi această plată?",
  delete_payment_desc: "Plata va fi eliminată din istoric, iar suma neachitată va deveni din nou restantă.",
  delete_payment: "Șterge plata",
  banned_identity: "Cont blocat · identitate disponibilă",
  unclaimed_identity: "Identitate nerevendicată",
  kick: "Elimină",
  ban: "Blochează",
  unban: "Deblochează",
  kick_member_title: "Îl elimini pe {name}?",
  kick_member_desc: "Contul va pierde imediat accesul. Identitatea va putea fi revendicată din nou de persoana corectă.",
  ban_member_title: "Blochezi contul lui {name}?",
  ban_member_desc: "Contul va pierde imediat accesul și nu va mai putea intra sau revendica altă identitate în această excursie.",
  unban_member_title: "Deblochezi contul eliminat de la {name}?",
  unban_member_desc: "Contul blocat anterior va putea intra din nou în această excursie.",
  moderation_preserves_data: "Persoana, cheltuielile, alocările și soldurile rămân în excursie. Detaliile de plată ale contului sunt șterse.",
  member_moderation_failed: "Acțiunea asupra membrului nu a putut fi finalizată.",
});
Object.assign(es, {
  delete: "Eliminar",
  working: "Procesando…",
  edit_payment: "Editar pago",
  edit_payment_desc: "Los administradores pueden corregir el importe o la fecha. Los saldos se actualizan inmediatamente.",
  maximum_supported_payment: "Máximo permitido por el saldo: {amount}",
  payment_date: "Fecha y hora del pago",
  payment_edit_invalid: "Introduce una fecha válida y un importe no superior a {amount}.",
  delete_payment_title: "¿Eliminar este pago?",
  delete_payment_desc: "El pago desaparecerá del historial y el importe pendiente volverá a mostrarse.",
  delete_payment: "Eliminar pago",
  banned_identity: "Cuenta bloqueada · identidad disponible",
  unclaimed_identity: "Identidad sin reclamar",
  kick: "Expulsar",
  ban: "Bloquear",
  unban: "Desbloquear",
  kick_member_title: "¿Expulsar a {name}?",
  kick_member_desc: "Su cuenta perderá el acceso inmediatamente. La identidad quedará disponible para que la reclame la persona correcta.",
  ban_member_title: "¿Bloquear a {name}?",
  ban_member_desc: "Su cuenta perderá el acceso y no podrá volver a entrar ni reclamar otra identidad en este viaje.",
  unban_member_title: "¿Desbloquear la cuenta eliminada de {name}?",
  unban_member_desc: "La cuenta bloqueada anteriormente podrá volver a unirse al viaje.",
  moderation_preserves_data: "La persona, los gastos, las asignaciones y los saldos permanecen. Se borran los datos de pago de la cuenta.",
  member_moderation_failed: "No se pudo completar la acción sobre el miembro.",
});
Object.assign(fr, {
  delete: "Supprimer",
  working: "Traitement…",
  edit_payment: "Modifier le paiement",
  edit_payment_desc: "Les administrateurs peuvent corriger le montant ou la date. Les soldes sont actualisés immédiatement.",
  maximum_supported_payment: "Maximum autorisé par le solde : {amount}",
  payment_date: "Date et heure du paiement",
  payment_edit_invalid: "Saisissez une date valide et un montant inférieur ou égal à {amount}.",
  delete_payment_title: "Supprimer ce paiement ?",
  delete_payment_desc: "Le paiement sera retiré de l’historique et le montant impayé redeviendra en attente.",
  delete_payment: "Supprimer le paiement",
  banned_identity: "Compte bloqué · identité disponible",
  unclaimed_identity: "Identité non revendiquée",
  kick: "Expulser",
  ban: "Bloquer",
  unban: "Débloquer",
  kick_member_title: "Expulser {name} ?",
  kick_member_desc: "Son compte perdra immédiatement l’accès. Cette identité pourra être revendiquée par la bonne personne.",
  ban_member_title: "Bloquer {name} ?",
  ban_member_desc: "Son compte perdra l’accès et ne pourra plus rejoindre ce voyage ni revendiquer une autre identité.",
  unban_member_title: "Débloquer le compte retiré de {name} ?",
  unban_member_desc: "Le compte précédemment bloqué pourra de nouveau rejoindre ce voyage.",
  moderation_preserves_data: "La personne, les dépenses, les attributions et les soldes restent dans le voyage. Les données de paiement du compte sont effacées.",
  member_moderation_failed: "L’action sur le membre n’a pas pu être effectuée.",
});
Object.assign(de, {
  delete: "Löschen",
  working: "Wird verarbeitet…",
  edit_payment: "Zahlung bearbeiten",
  edit_payment_desc: "Admins können Betrag oder Zahlungsdatum korrigieren. Die Gruppensalden werden sofort aktualisiert.",
  maximum_supported_payment: "Vom Saldo unterstützter Höchstbetrag: {amount}",
  payment_date: "Zahlungsdatum und -zeit",
  payment_edit_invalid: "Gib ein gültiges Datum und höchstens {amount} ein.",
  delete_payment_title: "Diese Zahlung löschen?",
  delete_payment_desc: "Die Zahlung wird aus dem Verlauf entfernt und der offene Betrag wird wieder fällig.",
  delete_payment: "Zahlung löschen",
  banned_identity: "Konto gesperrt · Identität verfügbar",
  unclaimed_identity: "Identität nicht beansprucht",
  kick: "Entfernen",
  ban: "Sperren",
  unban: "Entsperren",
  kick_member_title: "{name} entfernen?",
  kick_member_desc: "Das Konto verliert sofort den Zugriff. Die richtige Person kann diese Identität danach erneut beanspruchen.",
  ban_member_title: "{name} sperren?",
  ban_member_desc: "Das Konto verliert den Zugriff und kann dieser Reise nicht erneut beitreten oder eine andere Identität beanspruchen.",
  unban_member_title: "Das von {name} entfernte Konto entsperren?",
  unban_member_desc: "Das zuvor gesperrte Konto darf dieser Reise wieder beitreten.",
  moderation_preserves_data: "Person, Ausgaben, Zuweisungen und Salden bleiben erhalten. Die Zahlungsdaten des Kontos werden gelöscht.",
  member_moderation_failed: "Die Mitgliederaktion konnte nicht abgeschlossen werden.",
});

Object.assign(en, {
  actions: "Actions",
  no_actions_history: "No recorded actions yet",
  no_actions_history_desc: "Edits, deleted payments, and member moderation will appear here.",
  activity_expense_edited: "{actor} edited expense “{subject}”.",
  activity_stay_edited: "{actor} edited stay “{subject}”.",
  activity_car_edited: "{actor} edited car “{subject}”.",
  activity_payment_edited: "{actor} edited payment {subject}.",
  activity_payment_deleted: "{actor} deleted payment {subject}.",
  activity_member_kicked: "{actor} kicked {subject} from the trip.",
  activity_member_banned: "{actor} banned {subject} from the trip.",
  activity_member_unbanned: "{actor} unbanned the account removed from {subject}.",
  activity_fields_changed: "Changed: {fields}",
  activity_field_description: "description",
  activity_field_name: "name",
  activity_field_location: "location",
  activity_field_nights: "nights",
  activity_field_amount: "amount",
  activity_field_currency: "currency",
  activity_field_payer: "payer",
  activity_field_split: "split",
  activity_field_date: "date",
  activity_field_seats: "seats",
  your_payment: "Your payment",
  edit_stay: "Edit stay",
  edit_car: "Edit car",
  edit_stay_details: "Edit stay details",
  edit_car_details: "Edit car details",
  edit_logistics_financial_desc: "Review the details, price, currency, and payer before confirming the change.",
  edit_logistics_balance_warning: "Confirming may recalculate the group’s planned split. This change will be recorded in Actions.",
  confirm_changes: "Confirm changes",
  seat_limit_help: "Between {minimum} occupied seats and 60 seats.",
});
Object.assign(ro, {
  actions: "Acțiuni",
  no_actions_history: "Nu există acțiuni înregistrate",
  no_actions_history_desc: "Editările, plățile șterse și moderarea membrilor vor apărea aici.",
  activity_expense_edited: "{actor} a editat cheltuiala „{subject}”.",
  activity_stay_edited: "{actor} a editat cazarea „{subject}”.",
  activity_car_edited: "{actor} a editat mașina „{subject}”.",
  activity_payment_edited: "{actor} a editat plata {subject}.",
  activity_payment_deleted: "{actor} a șters plata {subject}.",
  activity_member_kicked: "{actor} l-a eliminat pe {subject} din excursie.",
  activity_member_banned: "{actor} l-a blocat pe {subject} în excursie.",
  activity_member_unbanned: "{actor} a deblocat contul eliminat de la {subject}.",
  activity_fields_changed: "Modificat: {fields}",
  activity_field_description: "descriere", activity_field_name: "nume", activity_field_location: "locație",
  activity_field_nights: "nopți", activity_field_amount: "sumă", activity_field_currency: "monedă",
  activity_field_payer: "plătitor", activity_field_split: "împărțire", activity_field_date: "dată", activity_field_seats: "locuri",
  your_payment: "Plata ta",
  edit_stay: "Editează cazarea", edit_car: "Editează mașina",
  edit_stay_details: "Editează cazarea", edit_car_details: "Editează mașina",
  edit_logistics_financial_desc: "Verifică detaliile, prețul, moneda și plătitorul înainte de confirmare.",
  edit_logistics_balance_warning: "Confirmarea poate recalcula împărțirea planificată. Schimbarea va fi înregistrată în Acțiuni.",
  confirm_changes: "Confirmă modificările",
  seat_limit_help: "Între cele {minimum} locuri ocupate și 60 de locuri.",
});
Object.assign(es, {
  actions: "Acciones",
  no_actions_history: "Aún no hay acciones registradas",
  no_actions_history_desc: "Las ediciones, pagos eliminados y moderación aparecerán aquí.",
  activity_expense_edited: "{actor} editó el gasto «{subject}».",
  activity_stay_edited: "{actor} editó el alojamiento «{subject}».",
  activity_car_edited: "{actor} editó el coche «{subject}».",
  activity_payment_edited: "{actor} editó el pago {subject}.",
  activity_payment_deleted: "{actor} eliminó el pago {subject}.",
  activity_member_kicked: "{actor} expulsó a {subject} del viaje.",
  activity_member_banned: "{actor} bloqueó a {subject} en el viaje.",
  activity_member_unbanned: "{actor} desbloqueó la cuenta retirada de {subject}.",
  activity_fields_changed: "Cambios: {fields}",
  activity_field_description: "descripción", activity_field_name: "nombre", activity_field_location: "ubicación",
  activity_field_nights: "noches", activity_field_amount: "importe", activity_field_currency: "moneda",
  activity_field_payer: "pagador", activity_field_split: "reparto", activity_field_date: "fecha", activity_field_seats: "plazas",
  your_payment: "Tu pago",
  edit_stay: "Editar alojamiento", edit_car: "Editar coche",
  edit_stay_details: "Editar alojamiento", edit_car_details: "Editar coche",
  edit_logistics_financial_desc: "Revisa los datos, el precio, la moneda y quién pagó antes de confirmar.",
  edit_logistics_balance_warning: "Confirmar puede recalcular el reparto del grupo. El cambio se registrará en Acciones.",
  confirm_changes: "Confirmar cambios",
  seat_limit_help: "Entre las {minimum} plazas ocupadas y 60 plazas.",
});
Object.assign(fr, {
  actions: "Actions",
  no_actions_history: "Aucune action enregistrée",
  no_actions_history_desc: "Les modifications, paiements supprimés et actions de modération apparaîtront ici.",
  activity_expense_edited: "{actor} a modifié la dépense « {subject} ».",
  activity_stay_edited: "{actor} a modifié l’hébergement « {subject} ».",
  activity_car_edited: "{actor} a modifié la voiture « {subject} ».",
  activity_payment_edited: "{actor} a modifié le paiement {subject}.",
  activity_payment_deleted: "{actor} a supprimé le paiement {subject}.",
  activity_member_kicked: "{actor} a expulsé {subject} du voyage.",
  activity_member_banned: "{actor} a bloqué {subject} dans le voyage.",
  activity_member_unbanned: "{actor} a débloqué le compte retiré de {subject}.",
  activity_fields_changed: "Modifié : {fields}",
  activity_field_description: "description", activity_field_name: "nom", activity_field_location: "lieu",
  activity_field_nights: "nuits", activity_field_amount: "montant", activity_field_currency: "devise",
  activity_field_payer: "payeur", activity_field_split: "partage", activity_field_date: "date", activity_field_seats: "places",
  your_payment: "Votre paiement",
  edit_stay: "Modifier l’hébergement", edit_car: "Modifier la voiture",
  edit_stay_details: "Modifier l’hébergement", edit_car_details: "Modifier la voiture",
  edit_logistics_financial_desc: "Vérifiez les détails, le prix, la devise et le payeur avant de confirmer.",
  edit_logistics_balance_warning: "La confirmation peut recalculer le partage du groupe. Le changement sera enregistré dans Actions.",
  confirm_changes: "Confirmer les modifications",
  seat_limit_help: "Entre les {minimum} places occupées et 60 places.",
});
Object.assign(de, {
  actions: "Aktionen",
  no_actions_history: "Noch keine Aktionen erfasst",
  no_actions_history_desc: "Bearbeitungen, gelöschte Zahlungen und Moderationsaktionen erscheinen hier.",
  activity_expense_edited: "{actor} hat die Ausgabe „{subject}“ bearbeitet.",
  activity_stay_edited: "{actor} hat die Unterkunft „{subject}“ bearbeitet.",
  activity_car_edited: "{actor} hat das Auto „{subject}“ bearbeitet.",
  activity_payment_edited: "{actor} hat die Zahlung {subject} bearbeitet.",
  activity_payment_deleted: "{actor} hat die Zahlung {subject} gelöscht.",
  activity_member_kicked: "{actor} hat {subject} aus der Reise entfernt.",
  activity_member_banned: "{actor} hat {subject} für die Reise gesperrt.",
  activity_member_unbanned: "{actor} hat das von {subject} entfernte Konto entsperrt.",
  activity_fields_changed: "Geändert: {fields}",
  activity_field_description: "Beschreibung", activity_field_name: "Name", activity_field_location: "Ort",
  activity_field_nights: "Nächte", activity_field_amount: "Betrag", activity_field_currency: "Währung",
  activity_field_payer: "zahlende Person", activity_field_split: "Aufteilung", activity_field_date: "Datum", activity_field_seats: "Sitze",
  your_payment: "Deine Zahlung",
  edit_stay: "Unterkunft bearbeiten", edit_car: "Auto bearbeiten",
  edit_stay_details: "Unterkunft bearbeiten", edit_car_details: "Auto bearbeiten",
  edit_logistics_financial_desc: "Prüfe Details, Preis, Währung und zahlende Person vor der Bestätigung.",
  edit_logistics_balance_warning: "Die Bestätigung kann die geplante Aufteilung neu berechnen. Die Änderung wird unter Aktionen protokolliert.",
  confirm_changes: "Änderungen bestätigen",
  seat_limit_help: "Zwischen {minimum} belegten Sitzen und 60 Sitzen.",
});

Object.assign(en, {
  trip_dates: "Trip dates",
  trip_dates_desc: "Set when the trip starts and ends so everyone can see the schedule at a glance.",
  trip_start_date: "Start date",
  trip_end_date: "End date",
  save_trip_dates: "Save dates",
  trip_dates_saved: "Trip dates saved.",
  trip_date_invalid: "Enter a valid trip date.",
  trip_date_range_invalid: "The trip end must be on or after the start date.",
  trip_dates_not_set: "Trip dates have not been set",
  set_trip_dates: "Set dates",
  edit_trip_dates: "Edit dates",
  trip_starts_on: "Starts {date}",
  trip_ends_on: "Ends {date}",
});
Object.assign(ro, {
  trip_dates: "Perioada excursiei",
  trip_dates_desc: "Setează când începe și când se termină excursia, pentru ca programul să fie clar pentru toți.",
  trip_start_date: "Data începerii", trip_end_date: "Data încheierii", save_trip_dates: "Salvează datele",
  trip_dates_saved: "Perioada excursiei a fost salvată.", trip_date_invalid: "Introdu o dată validă.",
  trip_date_range_invalid: "Data încheierii trebuie să fie aceeași cu sau după data începerii.",
  trip_dates_not_set: "Perioada excursiei nu este stabilită", set_trip_dates: "Stabilește perioada", edit_trip_dates: "Editează perioada",
  trip_starts_on: "Începe la {date}", trip_ends_on: "Se încheie la {date}",
});
Object.assign(es, {
  trip_dates: "Fechas del viaje",
  trip_dates_desc: "Define cuándo empieza y termina el viaje para que todos vean el calendario de un vistazo.",
  trip_start_date: "Fecha de inicio", trip_end_date: "Fecha de fin", save_trip_dates: "Guardar fechas",
  trip_dates_saved: "Fechas del viaje guardadas.", trip_date_invalid: "Introduce una fecha válida.",
  trip_date_range_invalid: "El final del viaje debe ser igual o posterior al inicio.",
  trip_dates_not_set: "Las fechas del viaje no están definidas", set_trip_dates: "Definir fechas", edit_trip_dates: "Editar fechas",
  trip_starts_on: "Empieza el {date}", trip_ends_on: "Termina el {date}",
});
Object.assign(fr, {
  trip_dates: "Dates du voyage",
  trip_dates_desc: "Indiquez le début et la fin du voyage afin que tout le monde voie le calendrier en un coup d’œil.",
  trip_start_date: "Date de début", trip_end_date: "Date de fin", save_trip_dates: "Enregistrer les dates",
  trip_dates_saved: "Dates du voyage enregistrées.", trip_date_invalid: "Saisissez une date valide.",
  trip_date_range_invalid: "La fin du voyage doit être identique ou postérieure au début.",
  trip_dates_not_set: "Les dates du voyage ne sont pas définies", set_trip_dates: "Définir les dates", edit_trip_dates: "Modifier les dates",
  trip_starts_on: "Début le {date}", trip_ends_on: "Fin le {date}",
});
Object.assign(de, {
  trip_dates: "Reisedaten",
  trip_dates_desc: "Lege Beginn und Ende der Reise fest, damit alle den Zeitraum auf einen Blick sehen.",
  trip_start_date: "Startdatum", trip_end_date: "Enddatum", save_trip_dates: "Daten speichern",
  trip_dates_saved: "Reisedaten gespeichert.", trip_date_invalid: "Gib ein gültiges Datum ein.",
  trip_date_range_invalid: "Das Reiseende muss am oder nach dem Startdatum liegen.",
  trip_dates_not_set: "Die Reisedaten sind noch nicht festgelegt", set_trip_dates: "Daten festlegen", edit_trip_dates: "Daten bearbeiten",
  trip_starts_on: "Beginn: {date}", trip_ends_on: "Ende: {date}",
});

Object.assign(en, {
  refresh_data: "Refresh data", refreshing_data: "Refreshing data…", data_updated: "Data updated", refresh_failed: "Refresh failed",
});
Object.assign(ro, {
  refresh_data: "Actualizează datele", refreshing_data: "Se actualizează datele…", data_updated: "Date actualizate", refresh_failed: "Actualizarea a eșuat",
});
Object.assign(es, {
  refresh_data: "Actualizar datos", refreshing_data: "Actualizando datos…", data_updated: "Datos actualizados", refresh_failed: "Error al actualizar",
});
Object.assign(fr, {
  refresh_data: "Actualiser les données", refreshing_data: "Actualisation des données…", data_updated: "Données actualisées", refresh_failed: "Échec de l’actualisation",
});
Object.assign(de, {
  refresh_data: "Daten aktualisieren", refreshing_data: "Daten werden aktualisiert…", data_updated: "Daten aktualisiert", refresh_failed: "Aktualisierung fehlgeschlagen",
});

Object.assign(en, {
  scroll_for_older_messages: "Scroll up for older messages", start_of_conversation: "Start of conversation",
});
Object.assign(ro, {
  scroll_for_older_messages: "Derulează în sus pentru mesaje mai vechi", start_of_conversation: "Începutul conversației",
});
Object.assign(es, {
  scroll_for_older_messages: "Desplázate hacia arriba para ver mensajes anteriores", start_of_conversation: "Inicio de la conversación",
});
Object.assign(fr, {
  scroll_for_older_messages: "Faites défiler vers le haut pour voir les anciens messages", start_of_conversation: "Début de la conversation",
});
Object.assign(de, {
  scroll_for_older_messages: "Nach oben scrollen, um ältere Nachrichten zu sehen", start_of_conversation: "Beginn der Unterhaltung",
});

Object.assign(en, {
  wishlist: "Wishlist", wishlist_desc: "Collect the places, stays, food and experiences your group would love to try.",
  wishlist_summary: "Wishlist summary", ideas: "Ideas", likes: "Likes", most_loved: "Most loved", add_idea: "Add idea",
  new_idea: "New wishlist idea", new_idea_desc: "Save an idea now and let the group show what they like.",
  idea_title: "Idea", idea_title_placeholder: "Sunset boat tour", idea_category: "Category", idea_details: "Notes",
  idea_details_placeholder: "Why it looks good, possible dates, or anything the group should know…", idea_link: "Link (optional)",
  idea_link_placeholder: "example.com/idea", save_idea: "Save idea", filter_ideas: "Filter ideas", liking_as: "Liking as",
  sort_by: "Sort by", newest: "Newest", no_wishlist_ideas: "No ideas yet", no_wishlist_ideas_desc: "Add the first possibility and let everyone heart their favourites.",
  no_filtered_ideas: "No ideas match this category yet.", add_first_idea: "Add the first idea", like_idea: "Like idea", unlike_idea: "Unlike idea",
  no_likes_yet: "No likes yet", added_by: "Added by {name}", shared_idea: "Shared idea", open_idea_link: "Open link", remove_idea: "Remove idea",
  remove_idea_confirm: "Remove this idea from the group wishlist?", wish_category_all: "All", wish_category_place: "Places",
  wish_category_stay: "Stays", wish_category_food: "Food", wish_category_activity: "Activities", wish_category_other: "Other",
  more: "More", more_desc: "Overview, group decisions and saved ideas.", more_overview_desc: "People, balances and trip dates.",
  more_decisions_desc: "Vote together before booking.", more_wishlist_desc: "Save ideas and heart your favourites.",
});
Object.assign(ro, {
  wishlist: "Listă de dorințe", wishlist_desc: "Adună locurile, cazările, restaurantele și experiențele pe care grupul ar vrea să le încerce.",
  wishlist_summary: "Rezumatul listei", ideas: "Idei", likes: "Aprecieri", most_loved: "Cele mai apreciate", add_idea: "Adaugă idee",
  new_idea: "Idee nouă", new_idea_desc: "Salvează o idee și lasă grupul să arate ce îi place.", idea_title: "Idee",
  idea_title_placeholder: "Tur cu barca la apus", idea_category: "Categorie", idea_details: "Notițe",
  idea_details_placeholder: "De ce pare interesantă, date posibile sau alte detalii…", idea_link: "Link (opțional)", idea_link_placeholder: "exemplu.ro/idee",
  save_idea: "Salvează ideea", filter_ideas: "Filtrează ideile", liking_as: "Apreciezi ca", sort_by: "Sortează după", newest: "Cele mai noi",
  no_wishlist_ideas: "Încă nu sunt idei", no_wishlist_ideas_desc: "Adaugă prima posibilitate și lasă-i pe toți să-și aleagă favoritele.",
  no_filtered_ideas: "Nu există încă idei în această categorie.", add_first_idea: "Adaugă prima idee", like_idea: "Apreciază ideea", unlike_idea: "Retrage aprecierea",
  no_likes_yet: "Nicio apreciere", added_by: "Adăugată de {name}", shared_idea: "Idee comună", open_idea_link: "Deschide linkul", remove_idea: "Șterge ideea",
  remove_idea_confirm: "Ștergi această idee din lista grupului?", wish_category_all: "Toate", wish_category_place: "Locuri", wish_category_stay: "Cazări",
  wish_category_food: "Mâncare", wish_category_activity: "Activități", wish_category_other: "Altele", more: "Mai multe",
  more_desc: "Prezentare generală, decizii și idei salvate.", more_overview_desc: "Persoane, solduri și datele excursiei.",
  more_decisions_desc: "Votați împreună înainte de rezervare.", more_wishlist_desc: "Salvați idei și apreciați favoritele.",
});
Object.assign(es, {
  wishlist: "Lista de deseos", wishlist_desc: "Reúne los lugares, alojamientos, comidas y experiencias que el grupo quiere probar.",
  wishlist_summary: "Resumen de la lista", ideas: "Ideas", likes: "Me gusta", most_loved: "Más populares", add_idea: "Añadir idea",
  new_idea: "Nueva idea", new_idea_desc: "Guarda una idea y deja que el grupo muestre cuáles le gustan.", idea_title: "Idea",
  idea_title_placeholder: "Paseo en barco al atardecer", idea_category: "Categoría", idea_details: "Notas",
  idea_details_placeholder: "Por qué parece buena, posibles fechas u otros detalles…", idea_link: "Enlace (opcional)", idea_link_placeholder: "ejemplo.com/idea",
  save_idea: "Guardar idea", filter_ideas: "Filtrar ideas", liking_as: "Indicas que te gusta como", sort_by: "Ordenar por", newest: "Más recientes",
  no_wishlist_ideas: "Aún no hay ideas", no_wishlist_ideas_desc: "Añade la primera posibilidad y deja que todos marquen sus favoritas.",
  no_filtered_ideas: "Todavía no hay ideas en esta categoría.", add_first_idea: "Añadir la primera idea", like_idea: "Me gusta", unlike_idea: "Ya no me gusta",
  no_likes_yet: "Aún no tiene me gusta", added_by: "Añadida por {name}", shared_idea: "Idea compartida", open_idea_link: "Abrir enlace", remove_idea: "Eliminar idea",
  remove_idea_confirm: "¿Eliminar esta idea de la lista del grupo?", wish_category_all: "Todas", wish_category_place: "Lugares", wish_category_stay: "Alojamientos",
  wish_category_food: "Comida", wish_category_activity: "Actividades", wish_category_other: "Otras", more: "Más",
  more_desc: "Resumen, decisiones del grupo e ideas guardadas.", more_overview_desc: "Personas, saldos y fechas del viaje.",
  more_decisions_desc: "Votad juntos antes de reservar.", more_wishlist_desc: "Guardad ideas y marcad las favoritas.",
});
Object.assign(fr, {
  wishlist: "Liste d’envies", wishlist_desc: "Rassemblez les lieux, hébergements, restaurants et expériences que le groupe aimerait essayer.",
  wishlist_summary: "Résumé de la liste", ideas: "Idées", likes: "J’aime", most_loved: "Plus appréciées", add_idea: "Ajouter une idée",
  new_idea: "Nouvelle idée", new_idea_desc: "Enregistrez une idée et laissez le groupe montrer ses préférences.", idea_title: "Idée",
  idea_title_placeholder: "Balade en bateau au coucher du soleil", idea_category: "Catégorie", idea_details: "Notes",
  idea_details_placeholder: "Pourquoi elle semble intéressante, dates possibles ou autres détails…", idea_link: "Lien (facultatif)", idea_link_placeholder: "exemple.fr/idee",
  save_idea: "Enregistrer", filter_ideas: "Filtrer les idées", liking_as: "Vous aimez en tant que", sort_by: "Trier par", newest: "Plus récentes",
  no_wishlist_ideas: "Aucune idée pour le moment", no_wishlist_ideas_desc: "Ajoutez la première possibilité et laissez chacun choisir ses favorites.",
  no_filtered_ideas: "Aucune idée dans cette catégorie.", add_first_idea: "Ajouter la première idée", like_idea: "J’aime", unlike_idea: "Je n’aime plus",
  no_likes_yet: "Aucun J’aime", added_by: "Ajoutée par {name}", shared_idea: "Idée partagée", open_idea_link: "Ouvrir le lien", remove_idea: "Supprimer l’idée",
  remove_idea_confirm: "Supprimer cette idée de la liste du groupe ?", wish_category_all: "Toutes", wish_category_place: "Lieux", wish_category_stay: "Hébergements",
  wish_category_food: "Repas", wish_category_activity: "Activités", wish_category_other: "Autres", more: "Plus",
  more_desc: "Vue d’ensemble, décisions et idées enregistrées.", more_overview_desc: "Membres, soldes et dates du voyage.",
  more_decisions_desc: "Votez ensemble avant de réserver.", more_wishlist_desc: "Enregistrez des idées et aimez vos favorites.",
});
Object.assign(de, {
  wishlist: "Wunschliste", wishlist_desc: "Sammelt Orte, Unterkünfte, Restaurants und Erlebnisse, die eure Gruppe ausprobieren möchte.",
  wishlist_summary: "Zusammenfassung", ideas: "Ideen", likes: "Likes", most_loved: "Beliebteste", add_idea: "Idee hinzufügen",
  new_idea: "Neue Idee", new_idea_desc: "Speichere eine Idee und lass die Gruppe ihre Favoriten zeigen.", idea_title: "Idee",
  idea_title_placeholder: "Bootstour bei Sonnenuntergang", idea_category: "Kategorie", idea_details: "Notizen",
  idea_details_placeholder: "Warum sie interessant ist, mögliche Termine oder weitere Details…", idea_link: "Link (optional)", idea_link_placeholder: "beispiel.de/idee",
  save_idea: "Idee speichern", filter_ideas: "Ideen filtern", liking_as: "Gefällt mir als", sort_by: "Sortieren nach", newest: "Neueste",
  no_wishlist_ideas: "Noch keine Ideen", no_wishlist_ideas_desc: "Füge die erste Möglichkeit hinzu, damit alle ihre Favoriten markieren können.",
  no_filtered_ideas: "In dieser Kategorie gibt es noch keine Ideen.", add_first_idea: "Erste Idee hinzufügen", like_idea: "Idee liken", unlike_idea: "Like entfernen",
  no_likes_yet: "Noch keine Likes", added_by: "Hinzugefügt von {name}", shared_idea: "Gemeinsame Idee", open_idea_link: "Link öffnen", remove_idea: "Idee entfernen",
  remove_idea_confirm: "Diese Idee aus der Gruppen-Wunschliste entfernen?", wish_category_all: "Alle", wish_category_place: "Orte", wish_category_stay: "Unterkünfte",
  wish_category_food: "Essen", wish_category_activity: "Aktivitäten", wish_category_other: "Andere", more: "Mehr",
  more_desc: "Übersicht, Gruppenentscheidungen und gespeicherte Ideen.", more_overview_desc: "Personen, Salden und Reisedaten.",
  more_decisions_desc: "Stimmt gemeinsam vor der Buchung ab.", more_wishlist_desc: "Speichert Ideen und markiert eure Favoriten.",
});

Object.assign(en, {
  settle_desc: "Choose a clear payment for each expense, or reduce the group to the fewest payments.",
  settlement_method: "Settlement method", by_expense: "By expense", primary: "Primary",
  by_expense_desc: "See who pays whom and exactly which cost each payment covers.",
  fewest_payments: "Fewest payments", fewest_payments_desc: "Net all balances into the smallest number of transfers.",
  expense_route_help: "Each payment stays tied to the person who covered the cost and its reason.",
});
Object.assign(ro, {
  settle_desc: "Alege o plată clară pentru fiecare cheltuială sau redu grupul la cât mai puține plăți.",
  settlement_method: "Metoda de decontare", by_expense: "După cheltuială", primary: "Principală",
  by_expense_desc: "Vezi cine plătește, cui plătește și exact ce cost acoperă fiecare plată.",
  fewest_payments: "Cele mai puține plăți", fewest_payments_desc: "Compensează soldurile în cel mai mic număr de transferuri.",
  expense_route_help: "Fiecare plată rămâne legată de persoana care a acoperit costul și de motivul ei.",
});
Object.assign(es, {
  settle_desc: "Elige un pago claro para cada gasto o reduce el grupo al mínimo de pagos.",
  settlement_method: "Método de liquidación", by_expense: "Por gasto", primary: "Principal",
  by_expense_desc: "Muestra quién paga a quién y qué gasto cubre exactamente cada pago.",
  fewest_payments: "Mínimo de pagos", fewest_payments_desc: "Compensa todos los saldos con el menor número de transferencias.",
  expense_route_help: "Cada pago queda vinculado a quien cubrió el gasto y a su motivo.",
});
Object.assign(fr, {
  settle_desc: "Choisissez un paiement clair par dépense ou réduisez le groupe au minimum de paiements.",
  settlement_method: "Méthode de règlement", by_expense: "Par dépense", primary: "Principale",
  by_expense_desc: "Voyez qui paie qui et quelle dépense chaque paiement couvre exactement.",
  fewest_payments: "Minimum de paiements", fewest_payments_desc: "Compensez tous les soldes avec le moins de virements possible.",
  expense_route_help: "Chaque paiement reste lié à la personne qui a avancé le coût et à son motif.",
});
Object.assign(de, {
  settle_desc: "Wähle eine klare Zahlung pro Ausgabe oder reduziere die Gruppe auf möglichst wenige Zahlungen.",
  settlement_method: "Ausgleichsmethode", by_expense: "Nach Ausgabe", primary: "Primär",
  by_expense_desc: "Zeigt, wer an wen zahlt und welche Kosten jede Zahlung genau abdeckt.",
  fewest_payments: "Wenigste Zahlungen", fewest_payments_desc: "Verrechnet alle Salden mit der kleinsten Anzahl an Überweisungen.",
  expense_route_help: "Jede Zahlung bleibt mit der Person, die die Kosten übernommen hat, und ihrem Grund verknüpft.",
});

Object.assign(en, {
  other_costs_help: "Expenses from the Expenses page appear here too. Add any other shared trip cost you need.",
  planned_split_desc: "All trip costs, payments, remaining amounts and payees in the selected currency.",
});
Object.assign(ro, {
  other_costs_help: "Cheltuielile din pagina Cheltuieli apar \u0219i aici. Adaug\u0103 orice alt cost comun de care ai nevoie.",
  planned_split_desc: "Toate costurile excursiei, pl\u0103\u021bile, sumele r\u0103mase \u0219i destinatarii \u00een moneda selectat\u0103.",
});
Object.assign(es, {
  other_costs_help: "Los gastos de la p\u00e1gina Gastos tambi\u00e9n aparecen aqu\u00ed. A\u00f1ade cualquier otro gasto compartido que necesites.",
  planned_split_desc: "Todos los gastos del viaje, pagos, saldos pendientes y destinatarios en la moneda seleccionada.",
});
Object.assign(fr, {
  other_costs_help: "Les d\u00e9penses de la page D\u00e9penses apparaissent aussi ici. Ajoutez tout autre frais partag\u00e9 n\u00e9cessaire.",
  planned_split_desc: "Tous les frais du voyage, paiements, soldes restants et destinataires dans la devise choisie.",
});
Object.assign(de, {
  other_costs_help: "Ausgaben von der Ausgabenseite erscheinen auch hier. F\u00fcge weitere gemeinsame Reisekosten nach Bedarf hinzu.",
  planned_split_desc: "Alle Reisekosten, Zahlungen, Restbetr\u00e4ge und Empf\u00e4nger in der ausgew\u00e4hlten W\u00e4hrung.",
});

Object.assign(en, {
  description_optional: "Description \u00b7 optional",
  description_placeholder: "Add useful context, notes, booking details, or instructions\u2026",
});
Object.assign(ro, {
  description_optional: "Descriere \u00b7 op\u021bional",
  description_placeholder: "Adaug\u0103 detalii utile, noti\u021be, informa\u021bii despre rezervare sau instruc\u021biuni\u2026",
});
Object.assign(es, {
  description_optional: "Descripci\u00f3n \u00b7 opcional",
  description_placeholder: "A\u00f1ade contexto, notas, datos de reserva o instrucciones\u2026",
});
Object.assign(fr, {
  description_optional: "Description \u00b7 facultative",
  description_placeholder: "Ajoutez du contexte, des notes, des informations de r\u00e9servation ou des instructions\u2026",
});
Object.assign(de, {
  description_optional: "Beschreibung \u00b7 optional",
  description_placeholder: "F\u00fcge Kontext, Notizen, Buchungsdetails oder Anweisungen hinzu\u2026",
});

const dictionaries = { en, ro, es, fr, de };

export function translate(language, key, variables = {}) {
  const template = dictionaries[language]?.[key] || en[key] || key;
  return Object.entries(variables).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}
