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
      { id: 1, category: 'services', question: 'Was beinhaltet eine Innenreinigung?', answer: 'Je nach gewähltem Paket reinigen wir Oberflächen, Cockpit, Sitze, Teppiche, Fussräume und Kofferraum. Der genaue Umfang wird in Ihrer Offerte transparent aufgeführt.' },
      { id: 2, category: 'services', question: 'Bieten Sie Keramikversiegelung an?', answer: 'Schutzbehandlungen und Versiegelungen können passend zu Fahrzeugzustand und gewünschter Haltbarkeit angeboten werden. Wir beraten Sie vor der Buchung zur geeigneten Lösung.' },
      { id: 3, category: 'services', question: 'Reinigen und pflegen Sie Leder?', answer: 'Ja. Lederflächen werden materialschonend gereinigt. Eine passende Pflege kann je nach Lederart und Zustand ergänzt werden.' },
      { id: 4, category: 'services', question: 'Entfernen Sie unangenehme Gerüche?', answer: 'Wir behandeln Geruchsquellen im Innenraum gründlich. Das Ergebnis hängt von Ursache und Tiefe der Belastung ab, weshalb wir den Zustand vorab mit Ihnen klären.' },
      { id: 5, category: 'services', question: 'Können Sie Kratzer auspolieren?', answer: 'Leichte Kratzer und Swirls lassen sich häufig durch professionelle Politur deutlich reduzieren. Tiefe Kratzer beurteilen wir vor Ort und nennen Ihnen realistisch das mögliche Ergebnis.' },
      { id: 6, category: 'process', question: 'Kommen Sie zu mir nach Hause oder ins Büro?', answer: 'Ja. RCC ist ein mobiler Autopflege-Service. Wir kommen nach Terminvereinbarung zu Ihrem gewünschten Standort und stimmen die Gegebenheiten vorab mit Ihnen ab.' },
      { id: 7, category: 'process', question: 'In welchen Regionen sind Sie verfügbar?', answer: 'Wir prüfen mobile Einsätze in der ganzen Schweiz nach Adresse und Terminverfügbarkeit. Wählen Sie Ihren Kanton auf der Karte oder nennen Sie uns Ihre Postleitzahl.' },
      { id: 8, category: 'process', question: 'Muss ich Wasser oder Strom bereitstellen?', answer: 'Das hängt von Behandlung und Standort ab. Bei der Terminbestätigung teilen wir Ihnen klar mit, welche Voraussetzungen vor Ort benötigt werden.' },
      { id: 9, category: 'process', question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Die Dauer richtet sich nach Fahrzeuggrösse, Zustand und Paket. Eine Pflege kann wenige Stunden dauern, eine intensive Aufbereitung entsprechend länger. Sie erhalten vorab eine Einschätzung.' },
      { id: 10, category: 'process', question: 'Kann ich mein Fahrzeug zu Ihnen bringen?', answer: 'Unser Schwerpunkt ist die mobile Pflege bei Ihnen vor Ort. Für besondere Fälle kontaktieren Sie uns bitte, damit wir die beste Lösung individuell abstimmen können.' },
      { id: 11, category: 'booking', question: 'Wie viel kostet die Reinigung?', answer: 'Die Preise richten sich nach Behandlung, Fahrzeugkategorie und Zustand. Wählen Sie auf der Website ein Paket und Ihre Fahrzeugart, danach erstellen wir eine kostenlose Offerte.' },
      { id: 12, category: 'booking', question: 'Wie kann ich einen Termin buchen?', answer: 'Senden Sie das Offertformular ab oder kontaktieren Sie uns per WhatsApp. Nach einer kurzen Abstimmung erhalten Sie Ihren verbindlichen Termin.' },
      { id: 13, category: 'booking', question: 'Welche Zahlungsmöglichkeiten gibt es?', answer: 'Die für Ihren Auftrag verfügbaren Zahlungsmöglichkeiten bestätigen wir zusammen mit der Offerte. Fragen Sie uns bei einer bevorzugten Zahlungsart gerne vorab.' },
      { id: 14, category: 'booking', question: 'Muss ich im Voraus bezahlen?', answer: 'Ob eine Vorauszahlung erforderlich ist, hängt vom Umfang des Auftrags ab. Alle Zahlungsbedingungen werden vor Ihrer verbindlichen Buchung klar bestätigt.' },
      { id: 15, category: 'booking', question: 'Kann ich einen Termin verschieben oder stornieren?', answer: 'Ja. Melden Sie sich bitte so früh wie möglich per Telefon oder WhatsApp. Wir prüfen dann direkt einen Ersatztermin und informieren Sie über die geltenden Bedingungen.' },
      { id: 16, category: 'special', question: 'Verwenden Sie umweltschonende Produkte?', answer: 'Wir wählen professionelle Produkte gezielt und materialgerecht aus und achten auf einen verantwortungsvollen Einsatz. Spezielle Produktwünsche können Sie bei der Anfrage angeben.' },
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
      { id: 1, category: 'services', question: 'Que comprend le nettoyage intérieur ?', answer: 'Selon la formule choisie, nous nettoyons les surfaces, le tableau de bord, les sièges, les tapis, les espaces pour les pieds et le coffre. Le détail figure clairement dans votre offre.' },
      { id: 2, category: 'services', question: 'Proposez-vous un traitement céramique ?', answer: 'Des protections et traitements peuvent être proposés selon l’état du véhicule et la durabilité souhaitée. Nous vous conseillons avant la réservation.' },
      { id: 3, category: 'services', question: 'Nettoyez-vous et entretenez-vous le cuir ?', answer: 'Oui. Les surfaces en cuir sont nettoyées avec soin. Un entretien adapté peut être ajouté selon le type et l’état du cuir.' },
      { id: 4, category: 'services', question: 'Éliminez-vous les mauvaises odeurs ?', answer: 'Nous traitons soigneusement les sources d’odeurs dans l’habitacle. Le résultat dépend de leur origine et de leur profondeur, que nous évaluons avec vous.' },
      { id: 5, category: 'services', question: 'Pouvez-vous polir les rayures ?', answer: 'Les rayures légères et les micro-rayures peuvent souvent être fortement atténuées par un polissage professionnel. Les rayures profondes sont évaluées sur place.' },
      { id: 6, category: 'process', question: 'Venez-vous à domicile ou au bureau ?', answer: 'Oui. RCC est un service mobile. Nous intervenons au lieu convenu et vérifions les conditions sur place avant le rendez-vous.' },
      { id: 7, category: 'process', question: 'Dans quelles régions intervenez-vous ?', answer: 'Nous étudions les interventions mobiles dans toute la Suisse selon l’adresse et les disponibilités. Sélectionnez votre canton sur la carte ou indiquez votre code postal.' },
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
      { id: 1, category: 'services', question: 'What does an interior cleaning include?', answer: 'Depending on the package, we clean surfaces, dashboard, seats, carpets, footwells and boot. The exact scope is listed clearly in your quote.' },
      { id: 2, category: 'services', question: 'Do you offer ceramic coatings?', answer: 'Protective treatments and coatings can be offered to suit the vehicle condition and desired durability. We recommend the right option before booking.' },
      { id: 3, category: 'services', question: 'Do you clean and condition leather?', answer: 'Yes. Leather surfaces are cleaned gently. Suitable conditioning can be added depending on the leather type and condition.' },
      { id: 4, category: 'services', question: 'Do you remove unpleasant odours?', answer: 'We thoroughly treat sources of odour inside the vehicle. The result depends on the cause and depth, which we clarify with you beforehand.' },
      { id: 5, category: 'services', question: 'Can you polish out scratches?', answer: 'Light scratches and swirl marks can often be greatly reduced with professional polishing. We assess deeper scratches on site and explain the realistic result.' },
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