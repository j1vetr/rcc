import type { Lang as Language } from '@/seo/routes';

export type FaqItem = {
  id: number;
  category: 'services' | 'process' | 'booking' | 'special';
  question: string;
  answer: string;
};

type AssistantCopy = {
  name: string;
  status: string;
  greeting: string;
  prompt: string;
  open: string;
  close: string;
  back: string;
  quote: string;
  whatsapp: string;
  categories: Record<FaqItem['category'], string>;
  items: FaqItem[];
};

export const assistantCopy: Record<Language, AssistantCopy> = {
  de: {
    name: 'RCC Concierge',
    status: 'Sofortauskunft',
    greeting: 'Grüezi. Wie dürfen wir Ihnen helfen?',
    prompt: 'Wählen Sie eine Frage. Unsere Antwort erscheint sofort.',
    open: 'RCC Hilfe öffnen',
    close: 'RCC Hilfe schliessen',
    back: 'Alle Fragen',
    quote: 'Offerte anfragen',
    whatsapp: 'Auf WhatsApp fragen',
    categories: {
      services: 'Leistungen',
      process: 'Ablauf',
      booking: 'Preis & Termin',
      special: 'Besondere Anliegen',
    },
    items: [
      { id: 1, category: 'services', question: 'Was beinhaltet eine Innenreinigung?', answer: 'Standard umfasst Druckluftreinigung, Saugen von Fahrgastraum und Kofferraum, Armaturenbrett, Türverkleidungen, Türfalze und Seitenscheiben innen. Premium ergänzt unter anderem Lüftungsdüsen, Pinseldetailreinigung, Lederreinigung und Fussmatten-Tiefenreinigung. Preise ab CHF 100 bzw. CHF 199.' },
      { id: 2, category: 'services', question: 'Bieten Sie Keramikversiegelung an?', answer: 'Eine Keramikversiegelung ist nicht im aktuellen Angebot aufgeführt. Wählbar sind eine Wachsbeschichtung für CHF 25 und eine Frontscheibenversiegelung für CHF 40.' },
      { id: 3, category: 'services', question: 'Reinigen und pflegen Sie Leder?', answer: 'Die schonende Lederreinigung gehört zur Innenreinigung Premium und zum Premium Aufbereitung Paket. Lederpflege ist als Zusatzleistung für CHF 100 wählbar.' },
      { id: 4, category: 'services', question: 'Entfernen Sie unangenehme Gerüche?', answer: 'Eine spezielle Geruchsbeseitigung ist nicht im aktuellen Angebot aufgeführt. Innenreinigung und wählbare Tiefenreinigungen sind auf der Paketseite beschrieben. Eine vollständige Geruchsentfernung wird damit nicht zugesichert.' },
      { id: 5, category: 'services', question: 'Können Sie Kratzer auspolieren?', answer: 'Politur und Kratzerkorrektur sind nicht Bestandteil der aktuellen Pakete und Zusatzleistungen. Die vollständigen Leistungen finden Sie auf der Paketseite.' },
      { id: 6, category: 'process', question: 'Kommen Sie zu mir nach Hause oder ins Büro?', answer: 'Ja. RCC ist ein mobiler Autopflege-Service. Wir kommen nach Terminvereinbarung zu Ihrem gewünschten Standort und stimmen die Gegebenheiten vorab mit Ihnen ab.' },
      { id: 7, category: 'process', question: 'In welchen Regionen sind Sie verfügbar?', answer: 'RCC ist in Zürich zuhause und als mobiler Service in der ganzen Schweiz für Sie im Einsatz. Nennen Sie uns Ihre Adresse oder Postleitzahl für Ihren gewünschten Termin und Standort.' },
      { id: 8, category: 'process', question: 'Muss ich Wasser oder Strom bereitstellen?', answer: 'Das hängt von Behandlung und Standort ab. Bei der Terminbestätigung teilen wir Ihnen klar mit, welche Voraussetzungen vor Ort benötigt werden.' },
      { id: 9, category: 'process', question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Die Dauer richtet sich nach Fahrzeuggrösse, Zustand und Paket. Eine Pflege kann wenige Stunden dauern, eine intensive Aufbereitung entsprechend länger. Sie erhalten vorab eine Einschätzung.' },
      { id: 10, category: 'process', question: 'Kann ich mein Fahrzeug zu Ihnen bringen?', answer: 'Unser Schwerpunkt ist die mobile Pflege bei Ihnen vor Ort. Für besondere Fälle kontaktieren Sie uns bitte, damit wir die beste Lösung individuell abstimmen können.' },
      { id: 11, category: 'booking', question: 'Wie viel kostet die Reinigung?', answer: 'Die Preise richten sich nach Behandlung, Fahrzeugkategorie und Zustand. Wählen Sie auf der Website ein Paket und Ihre Fahrzeugart, danach erstellen wir eine kostenlose Offerte.' },
      { id: 12, category: 'booking', question: 'Wie kann ich einen Termin buchen?', answer: 'Senden Sie das Offertformular ab oder kontaktieren Sie uns per WhatsApp. Nach einer kurzen Abstimmung erhalten Sie Ihren verbindlichen Termin.' },
      { id: 13, category: 'booking', question: 'Welche Zahlungsmöglichkeiten gibt es?', answer: 'Die für Ihren Auftrag verfügbaren Zahlungsmöglichkeiten bestätigen wir zusammen mit der Offerte. Fragen Sie uns bei einer bevorzugten Zahlungsart gerne vorab.' },
      { id: 14, category: 'booking', question: 'Muss ich im Voraus bezahlen?', answer: 'Ob eine Vorauszahlung erforderlich ist, hängt vom Umfang des Auftrags ab. Alle Zahlungsbedingungen werden vor Ihrer verbindlichen Buchung klar bestätigt.' },
      { id: 15, category: 'booking', question: 'Kann ich einen Termin verschieben oder stornieren?', answer: 'Ja. Melden Sie sich bitte so früh wie möglich per Telefon oder WhatsApp. Wir prüfen dann direkt einen Ersatztermin und informieren Sie über die geltenden Bedingungen.' },
      { id: 16, category: 'special', question: 'Welche Produkte verwenden Sie?', answer: 'Wir wählen professionelle Produkte gezielt und materialgerecht aus. Spezielle Produktwünsche können Sie bei der Anfrage angeben.' },
      { id: 17, category: 'special', question: 'Können Sie starke Hundehaare entfernen?', answer: 'Ja. Tierhaare können intensiv entfernt werden. Bei sehr starker Belastung entsteht zusätzlicher Aufwand, den wir vor Beginn transparent mit Ihnen abstimmen.' },
      { id: 18, category: 'special', question: 'Entfernen Sie Kaffee-, Öl- oder andere Flecken?', answer: 'Viele hartnäckige Flecken lassen sich professionell behandeln. Material, Alter und Tiefe des Flecks bestimmen das Ergebnis. Senden Sie uns am besten vorab ein Foto.' },
      { id: 19, category: 'special', question: 'Reinigen Sie auch Firmenflotten?', answer: 'Ja, individuelle Lösungen für mehrere Geschäftsfahrzeuge sind möglich. Teilen Sie uns Anzahl, Fahrzeugtypen, Standort und gewünschten Rhythmus mit.' },
      { id: 20, category: 'special', question: 'Erhalte ich eine Rechnung für mein Unternehmen?', answer: 'Eine geschäftliche Rechnung kann für Ihren Auftrag ausgestellt werden. Geben Sie die korrekte Firmen- und Rechnungsadresse bei der Anfrage an.' },
    ],
  },
  fr: {
    name: 'Concierge RCC',
    status: 'Réponse immédiate',
    greeting: 'Bonjour. Comment pouvons-nous vous aider ?',
    prompt: 'Choisissez une question. La réponse apparaît immédiatement.',
    open: 'Ouvrir l’aide RCC',
    close: 'Fermer l’aide RCC',
    back: 'Toutes les questions',
    quote: 'Demander une offre',
    whatsapp: 'Poser la question sur WhatsApp',
    categories: {
      services: 'Prestations',
      process: 'Déroulement',
      booking: 'Prix et rendez-vous',
      special: 'Demandes particulières',
    },
    items: [
      { id: 1, category: 'services', question: 'Que comprend le nettoyage intérieur ?', answer: 'Standard comprend l’air comprimé, l’aspiration de l’habitacle et du coffre, le tableau de bord, les panneaux et feuillures de portes et les vitres latérales intérieures. Premium ajoute notamment aérateurs, nettoyage au pinceau, cuir et tapis en profondeur. Dès CHF 100 et CHF 199 respectivement.' },
      { id: 2, category: 'services', question: 'Proposez-vous un traitement céramique ?', answer: 'Un traitement céramique ne figure pas dans l’offre actuelle. Un revêtement de cire à CHF 25 et un scellement du pare-brise à CHF 40 sont disponibles en supplément.' },
      { id: 3, category: 'services', question: 'Nettoyez-vous et entretenez-vous le cuir ?', answer: 'Le nettoyage doux du cuir est inclus dans Intérieur Premium et le forfait de préparation Premium. Le soin du cuir est disponible en supplément à CHF 100.' },
      { id: 4, category: 'services', question: 'Éliminez-vous les mauvaises odeurs ?', answer: 'Un traitement spécifique des odeurs ne figure pas dans l’offre actuelle. Le nettoyage intérieur et les nettoyages en profondeur optionnels sont décrits sur la page des forfaits. Ils ne garantissent pas l’élimination complète des odeurs.' },
      { id: 5, category: 'services', question: 'Pouvez-vous polir les rayures ?', answer: 'Le polissage et la correction des rayures ne font pas partie des forfaits et suppléments actuels. Toutes les prestations figurent sur la page des forfaits.' },
      { id: 6, category: 'process', question: 'Venez-vous à domicile ou au bureau ?', answer: 'Oui. RCC est un service mobile. Nous intervenons au lieu convenu et vérifions les conditions sur place avant le rendez-vous.' },
      { id: 7, category: 'process', question: 'Dans quelles régions intervenez-vous ?', answer: 'Basé à Zurich, RCC propose un nettoyage automobile mobile dans toute la Suisse. Indiquez votre adresse ou code postal pour convenir du lieu et du rendez-vous souhaités.' },
      { id: 8, category: 'process', question: 'Dois-je fournir de l’eau ou de l’électricité ?', answer: 'Cela dépend du traitement et du lieu. Lors de la confirmation, nous précisons clairement les conditions nécessaires sur place.' },
      { id: 9, category: 'process', question: 'Combien de temps dure une préparation ?', answer: 'La durée dépend de la taille, de l’état du véhicule et de la formule. Elle peut aller de quelques heures à davantage pour une préparation intensive.' },
      { id: 10, category: 'process', question: 'Puis-je déposer mon véhicule chez vous ?', answer: 'Notre activité est principalement mobile. Pour une situation particulière, contactez-nous afin que nous trouvions la meilleure solution.' },
      { id: 11, category: 'booking', question: 'Combien coûte le nettoyage ?', answer: 'Le prix dépend du traitement, de la catégorie et de l’état du véhicule. Choisissez une formule et votre véhicule pour recevoir une offre gratuite.' },
      { id: 12, category: 'booking', question: 'Comment réserver un rendez-vous ?', answer: 'Envoyez le formulaire d’offre ou contactez-nous sur WhatsApp. Après une courte confirmation, vous recevez votre rendez-vous définitif.' },
      { id: 13, category: 'booking', question: 'Quels moyens de paiement acceptez-vous ?', answer: 'Les moyens disponibles pour votre intervention sont confirmés avec l’offre. Indiquez-nous à l’avance si vous préférez un mode particulier.' },
      { id: 14, category: 'booking', question: 'Dois-je payer à l’avance ?', answer: 'Une avance peut dépendre de l’ampleur du travail. Toutes les conditions sont communiquées clairement avant la réservation définitive.' },
      { id: 15, category: 'booking', question: 'Puis-je déplacer ou annuler un rendez-vous ?', answer: 'Oui. Prévenez-nous le plus tôt possible par téléphone ou WhatsApp. Nous chercherons une nouvelle date et confirmerons les conditions applicables.' },
      { id: 16, category: 'special', question: 'Utilisez-vous des produits respectueux de l’environnement ?', answer: 'Nous sélectionnons des produits professionnels adaptés aux matériaux et les utilisons de façon responsable. Vous pouvez indiquer toute demande particulière.' },
      { id: 17, category: 'special', question: 'Pouvez-vous retirer beaucoup de poils de chien ?', answer: 'Oui. Une élimination intensive est possible. Un supplément peut s’appliquer en cas de forte présence, toujours annoncé avant le début.' },
      { id: 18, category: 'special', question: 'Traitez-vous les taches de café ou d’huile ?', answer: 'De nombreuses taches tenaces peuvent être traitées. Le matériau, l’ancienneté et la profondeur influencent le résultat. Envoyez-nous idéalement une photo.' },
      { id: 19, category: 'special', question: 'Nettoyez-vous les flottes d’entreprise ?', answer: 'Oui, des solutions personnalisées sont possibles. Indiquez le nombre de véhicules, les types, le lieu et la fréquence souhaitée.' },
      { id: 20, category: 'special', question: 'Puis-je recevoir une facture pour mon entreprise ?', answer: 'Une facture professionnelle peut être établie. Indiquez la raison sociale et l’adresse de facturation correctes lors de votre demande.' },
    ],
  },
  en: {
    name: 'RCC Concierge',
    status: 'Instant answers',
    greeting: 'Hello. How can we help you?',
    prompt: 'Choose a question and see the answer immediately.',
    open: 'Open RCC help',
    close: 'Close RCC help',
    back: 'All questions',
    quote: 'Request a quote',
    whatsapp: 'Ask on WhatsApp',
    categories: {
      services: 'Services',
      process: 'Process',
      booking: 'Price & booking',
      special: 'Special requests',
    },
    items: [
      { id: 1, category: 'services', question: 'What does an interior cleaning include?', answer: 'Standard covers compressed-air cleaning, cabin and boot vacuuming, dashboard, door panels, door jambs and interior side windows. Premium also includes air vents, brush detailing, leather cleaning and deep cleaning of floor mats. Prices start at CHF 100 and CHF 199 respectively.' },
      { id: 2, category: 'services', question: 'Do you offer ceramic coatings?', answer: 'Ceramic coating is not listed in the current offering. Wax coating for CHF 25 and windscreen sealing for CHF 40 are available as extras.' },
      { id: 3, category: 'services', question: 'Do you clean and condition leather?', answer: 'Gentle leather cleaning is included in Interior Premium and the Premium Detailing Package. Leather care is available as an extra for CHF 100.' },
      { id: 4, category: 'services', question: 'Do you remove unpleasant odours?', answer: 'Specialist odour removal is not listed in the current offering. Interior cleaning and optional deep cleaning are described on the packages page. These do not guarantee complete odour removal.' },
      { id: 5, category: 'services', question: 'Can you polish out scratches?', answer: 'Polishing and scratch correction are not included in the current packages or extras. All available services are listed on the packages page.' },
      { id: 6, category: 'process', question: 'Do you come to my home or office?', answer: 'Yes. RCC is a mobile car care service. We come to the agreed location and confirm the site requirements with you beforehand.' },
      { id: 7, category: 'process', question: 'Which regions do you cover?', answer: 'We assess mobile appointments throughout Switzerland based on the address and availability. Select your canton on the map or tell us your postcode.' },
      { id: 8, category: 'process', question: 'Do I need to provide water or electricity?', answer: 'This depends on the treatment and location. When confirming the appointment, we clearly explain what is required on site.' },
      { id: 9, category: 'process', question: 'How long does a detailing appointment take?', answer: 'The duration depends on vehicle size, condition and package. It may take a few hours, while intensive detailing can take longer. We provide an estimate in advance.' },
      { id: 10, category: 'process', question: 'Can I drop my vehicle off with you?', answer: 'Our main service is mobile care at your location. For special circumstances, contact us and we will arrange the best individual solution.' },
      { id: 11, category: 'booking', question: 'How much does the cleaning cost?', answer: 'Pricing depends on the treatment, vehicle category and condition. Choose a package and vehicle type on the website to request a free quote.' },
      { id: 12, category: 'booking', question: 'How do I book an appointment?', answer: 'Submit the quote form or contact us on WhatsApp. After a short consultation, we will confirm your appointment.' },
      { id: 13, category: 'booking', question: 'Which payment methods do you accept?', answer: 'The available payment methods for your appointment are confirmed with the quote. Let us know beforehand if you prefer a specific method.' },
      { id: 14, category: 'booking', question: 'Do I need to pay in advance?', answer: 'Whether a deposit is required depends on the scope of the job. All payment terms are clearly confirmed before you make a binding booking.' },
      { id: 15, category: 'booking', question: 'Can I reschedule or cancel?', answer: 'Yes. Please contact us as early as possible by phone or WhatsApp. We will look for another date and confirm the applicable terms.' },
      { id: 16, category: 'special', question: 'Do you use environmentally responsible products?', answer: 'We select professional, material-appropriate products and use them responsibly. You can mention any specific product requirements in your enquiry.' },
      { id: 17, category: 'special', question: 'Can you remove heavy dog hair?', answer: 'Yes. Intensive pet hair removal is available. Heavy contamination may require extra work, which we agree transparently before starting.' },
      { id: 18, category: 'special', question: 'Can you treat coffee, oil or other stains?', answer: 'Many stubborn stains can be professionally treated. Material, age and depth affect the result. It is best to send us a photo beforehand.' },
      { id: 19, category: 'special', question: 'Do you clean company fleets?', answer: 'Yes, tailored solutions for multiple business vehicles are available. Tell us the quantity, vehicle types, location and preferred frequency.' },
      { id: 20, category: 'special', question: 'Can my company receive an invoice?', answer: 'A business invoice can be issued for your appointment. Provide the correct company and billing address with your enquiry.' },
    ],
  },
};