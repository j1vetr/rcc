import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { useSubmitQuote, useListServices } from '@workspace/api-client-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, useFormField
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CarTypePicker } from './CarTypePicker';

// Error messages are stable codes, mapped to localized text at render time
const formSchema = z.object({
  name: z.string().min(2, 'required'),
  email: z.string().email('email'),
  phone: z.string().min(5, 'required'),
  canton: z.string().min(2, 'required'),
  serviceType: z.string().min(1, 'required'),
  carType: z.string().min(1, 'required'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function LocalizedFormMessage() {
  const { error } = useFormField();
  const { t } = useTranslation();
  if (!error) return null;
  const code = String(error.message ?? '');
  const messages = t.quote.validation as Record<string, string>;
  return <p className="text-destructive text-xs">{messages[code] ?? code}</p>;
}

const STEP_FIELDS: Array<Array<keyof FormValues>> = [
  ['carType', 'canton'],
  ['serviceType'],
  ['name', 'email', 'phone'],
  [],
];

const inputClass =
  'bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-2 h-auto text-base font-light text-foreground placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors shadow-none';
const labelClass =
  'text-foreground/50 uppercase tracking-[0.2em] text-[10px] font-medium transition-colors group-focus-within:text-primary';

export function QuoteForm() {
  const { t, lang } = useTranslation();
  const submitQuote = useSubmitQuote();
  const { data: services } = useListServices({ query: { queryKey: ['services'] } });
  const [step, setStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      canton: '',
      serviceType: '',
      carType: '',
      message: '',
    }
  });

  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const customEvent = e as CustomEvent<{ serviceId?: string; carType?: string } | string>;
      const selection = customEvent.detail;
      form.setValue('serviceType', typeof selection === 'string' ? selection : selection.serviceId ?? '');
      if (typeof selection !== 'string' && selection.carType) {
        form.setValue('carType', selection.carType);
      }
    };

    const handleSelectCanton = (e: Event) => {
      const customEvent = e as CustomEvent;
      form.setValue('canton', customEvent.detail);
    };

    window.addEventListener('select-service', handleSelectService);
    window.addEventListener('select-canton', handleSelectCanton);
    return () => {
      window.removeEventListener('select-service', handleSelectService);
      window.removeEventListener('select-canton', handleSelectCanton);
    };
  }, [form]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service');
    const carType = params.get('car');
    const validCarTypes = ['small', 'medium', 'large', 'xl'];

    if (!serviceId && !validCarTypes.includes(carType ?? '')) return;

    form.reset({
      ...form.getValues(),
      serviceType: serviceId ?? '',
      carType: validCarTypes.includes(carType ?? '') ? carType! : '',
    });
  }, [form]);

  const onSubmit = (data: FormValues) => {
    submitQuote.mutate({ data });
  };

  const onInvalid = () => {
    const errors = form.formState.errors;
    const firstInvalidStep = STEP_FIELDS.findIndex((fields) =>
      fields.some((field) => errors[field]),
    );
    if (firstInvalidStep >= 0) setStep(firstInvalidStep);
  };

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (valid) setStep((value) => Math.min(value + 1, 3));
  };

  const goBack = () => setStep((value) => Math.max(value - 1, 0));

  // Guided flow: picking a value advances to the next step after a short beat
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleAdvance = useCallback((fromStep: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setStep((current) => (current === fromStep ? fromStep + 1 : current));
    }, 350);
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const getLocalizedServiceName = (service: any) => {
    const key = `name${lang.toUpperCase()}` as keyof typeof service;
    return service[key];
  };

  const watchedCanton = form.watch('canton');
  const watchedCarType = form.watch('carType');
  const watchedServiceType = form.watch('serviceType');
  const watchedName = form.watch('name');

  // Auto-advance only when the value actually changes while on the matching step,
  // so back-navigation to a completed step never re-fires a forward jump
  const prevCarType = useRef('');
  const prevServiceType = useRef('');

  useEffect(() => {
    const changed = watchedCarType !== prevCarType.current;
    prevCarType.current = watchedCarType;
    if (!changed || step !== 0 || !watchedCarType) return;
    const cantonValid = formSchema.shape.canton.safeParse(form.getValues('canton')).success;
    if (cantonValid) {
      scheduleAdvance(0);
    } else {
      document.querySelector<HTMLInputElement>('[data-testid="input-canton"]')?.focus();
    }
  }, [watchedCarType, step, form, scheduleAdvance]);

  useEffect(() => {
    const changed = watchedServiceType !== prevServiceType.current;
    prevServiceType.current = watchedServiceType;
    if (changed && step === 1 && watchedServiceType) scheduleAdvance(1);
  }, [watchedServiceType, step, scheduleAdvance]);

  const selectedService = useMemo(
    () => services?.find((service) => service.id === watchedServiceType),
    [services, watchedServiceType],
  );
  const selectedPrice = selectedService && watchedCarType
    ? selectedService.prices[watchedCarType as keyof typeof selectedService.prices]
    : undefined;

  const wizard = t.quote.wizard;
  const carTypeLabel = watchedCarType
    ? t.quote.carTypes[watchedCarType as keyof typeof t.quote.carTypes]
    : undefined;

  if (submitQuote.isSuccess) {
    return (
      <section id="quote" className="py-32 min-h-[80vh] flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none opacity-50" />

        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }}
              className="w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center mb-10 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm shadow-[0_0_40px_rgba(201,165,83,0.15)]"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-8 tracking-tight">
              {t.quote.form.successTitle}
            </h2>
            <div className="w-20 h-px gold-divider mb-8" />
            <p className="text-foreground/60 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto">
              {t.quote.form.successDesc}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-16 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-5 sm:px-6 lg:px-10 relative z-10">
        <div className="border border-white/10 bg-[#090909]/85">
          {/* Header */}
          <div className="grid gap-7 border-b border-white/10 p-5 sm:p-7 lg:grid-cols-[1fr_1.15fr] lg:items-end lg:gap-12 lg:p-9">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-3 flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-primary">
                  <span>{wizard.stepOf} {String(step + 1).padStart(2, '0')}</span>
                  <span className="h-px w-8 bg-primary/50" />
                  <span>04</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-light text-foreground mb-4 leading-[1.02] tracking-tight">
                  {t.quote.title}
                </h2>
                <p className="text-foreground/55 text-sm sm:text-base font-light leading-relaxed max-w-xl">
                  {t.quote.subtitle}
                </p>
              </motion.div>
            </div>

            <div className="hidden gap-3 border-l border-white/10 pl-10 text-xs text-foreground/50 lg:grid lg:grid-cols-2">
                <a href="tel:+41788803884" className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                  +41 78 880 38 84
                </a>
                <a href="mailto:Info@royalcarcleaning.ch" className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                  <span className="break-all">Info@royalcarcleaning.ch</span>
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Wechsel%C3%A4cherstrasse%2025%2C%208103%20Z%C3%BCrich"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-primary"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                  <span>Wechselächerstrasse 25, 8103 Zürich</span>
                </a>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
              <div className="grid lg:grid-cols-[1fr_330px]">
                {/* Wizard column */}
                <div className="p-5 sm:p-7 lg:p-9 lg:border-r lg:border-white/10">
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      {wizard.steps.map((label, index) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => index < step && setStep(index)}
                          disabled={index >= step}
                          className={`flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] transition-colors ${
                            index === step
                              ? 'text-primary'
                              : index < step
                                ? 'text-foreground/60 hover:text-primary'
                                : 'text-foreground/30'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center border text-[9px] ${
                              index < step
                                ? 'border-primary bg-primary text-background'
                                : index === step
                                  ? 'border-primary text-primary'
                                  : 'border-white/15 text-foreground/30'
                            }`}
                          >
                            {index < step ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}
                          </span>
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="h-px w-full bg-white/10">
                      <motion.div
                        className="h-px bg-primary shadow-[0_0_8px_rgba(201,165,83,0.7)]"
                        initial={false}
                        animate={{ width: `${((step + 1) / wizard.steps.length) * 100}%` }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>

                  {/* Steps */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {step === 0 && (
                        <div className="space-y-8">
                          <FormField
                            control={form.control}
                            name="carType"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className={`${labelClass} block`}>
                                  {t.quote.form.carType}
                                </FormLabel>
                                <FormControl>
                                  <div>
                                    <CarTypePicker
                                      value={field.value}
                                      onChange={field.onChange}
                                      options={t.quote.carTypes}
                                    />
                                  </div>
                                </FormControl>
                                <LocalizedFormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="canton"
                            render={({ field }) => (
                              <FormItem className="space-y-3 relative group max-w-xs">
                                <FormLabel className={labelClass}>
                                  {t.quote.form.canton}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-canton"
                                    placeholder={t.quote.form.placeholders.canton}
                                    {...field}
                                    className={inputClass}
                                  />
                                </FormControl>
                                <LocalizedFormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {step === 1 && (
                        <FormField
                          control={form.control}
                          name="serviceType"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormLabel className={`${labelClass} block`}>
                                {t.quote.form.serviceType}
                              </FormLabel>
                              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {services?.map((service) => {
                                  const isActive = field.value === service.id;
                                  return (
                                    <button
                                      key={service.id}
                                      type="button"
                                      data-testid={`option-service-${service.id}`}
                                      onClick={() => field.onChange(service.id)}
                                      aria-pressed={isActive}
                                      className={`group border p-4 sm:p-5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                                        isActive
                                          ? 'border-primary/70 bg-primary/[0.08] shadow-[0_0_24px_rgba(201,165,83,0.12)]'
                                          : 'border-white/10 bg-card/40 hover:border-primary/40'
                                      }`}
                                    >
                                      <span className={`mb-3 block h-px w-8 transition-colors ${isActive ? 'bg-primary' : 'bg-white/15 group-hover:bg-primary/50'}`} />
                                      <span className={`block text-sm sm:text-base font-light leading-snug ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                        {getLocalizedServiceName(service)}
                                      </span>
                                      <span className={`mt-3 block text-[10px] uppercase tracking-[0.18em] ${isActive ? 'text-primary/80' : 'text-foreground/40'}`}>
                                        {watchedCarType
                                          ? `CHF ${service.prices[watchedCarType as keyof typeof service.prices]}`
                                          : `${t.services.priceFrom} CHF ${service.prices.small}`}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                              <LocalizedFormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {step === 2 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-7">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="space-y-3 relative group">
                                <FormLabel className={labelClass}>{t.quote.form.name}</FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-name"
                                    placeholder={t.quote.form.placeholders.name}
                                    {...field}
                                    className={inputClass}
                                  />
                                </FormControl>
                                <LocalizedFormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="space-y-3 relative group">
                                <FormLabel className={labelClass}>{t.quote.form.email}</FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-email"
                                    type="email"
                                    placeholder={t.quote.form.placeholders.email}
                                    {...field}
                                    className={inputClass}
                                  />
                                </FormControl>
                                <LocalizedFormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="space-y-3 relative group">
                                <FormLabel className={labelClass}>{t.quote.form.phone}</FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-phone"
                                    type="tel"
                                    placeholder={t.quote.form.placeholders.phone}
                                    {...field}
                                    className={inputClass}
                                  />
                                </FormControl>
                                <LocalizedFormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem className="space-y-3 relative group sm:col-span-2">
                                <FormLabel className={labelClass}>{t.quote.form.message}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    data-testid="input-message"
                                    placeholder={t.quote.form.placeholders.message}
                                    {...field}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-3 min-h-[72px] resize-none text-base font-light leading-relaxed text-foreground placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors shadow-none"
                                  />
                                </FormControl>
                                <LocalizedFormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-6">
                          <p className="text-foreground/55 text-sm font-light leading-relaxed max-w-lg">
                            {wizard.reviewHint}
                          </p>
                          <dl className="divide-y divide-white/10 border-y border-white/10">
                            {[
                              { label: wizard.canton, value: watchedCanton },
                              { label: wizard.car, value: carTypeLabel },
                              { label: wizard.package, value: selectedService ? getLocalizedServiceName(selectedService) : undefined },
                              { label: wizard.estimate, value: selectedPrice ? `CHF ${selectedPrice}` : undefined },
                              { label: wizard.contact, value: watchedName },
                            ].map((row) => (
                              <div key={row.label} className="flex items-center justify-between gap-4 py-3.5">
                                <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">{row.label}</dt>
                                <dd className={`text-sm font-light text-right ${row.value ? 'text-foreground' : 'text-foreground/35'}`}>
                                  {row.value || wizard.notSelected}
                                </dd>
                              </div>
                            ))}
                          </dl>
                          <button
                            type="submit"
                            data-testid="button-submit-quote"
                            disabled={submitQuote.isPending}
                            className="w-full btn-gold-luxury h-14 uppercase tracking-[0.17em] text-xs font-semibold text-background disabled:opacity-50 disabled:cursor-not-allowed px-8"
                          >
                            {submitQuote.isPending ? t.quote.form.submitting : t.quote.form.submit}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Nav */}
                  <div className="mt-9 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={step === 0}
                      className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/50 transition-colors hover:text-primary disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      {wizard.back}
                    </button>
                    {step < 3 && (
                      <button
                        type="button"
                        data-testid="button-wizard-next"
                        onClick={goNext}
                        className="btn-gold-luxury flex items-center gap-2.5 min-h-11 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-background"
                      >
                        {wizard.next}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Live summary panel */}
                <aside className="border-t border-white/10 bg-primary/[0.03] p-5 sm:p-7 lg:border-t-0 lg:p-8">
                  <p className="mb-5 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-primary">
                    {wizard.summaryTitle}
                  </p>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1">{wizard.canton}</dt>
                      <dd className={`text-sm font-light ${watchedCanton ? 'text-foreground' : 'text-foreground/30'}`}>
                        {watchedCanton || wizard.notSelected}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1">{wizard.car}</dt>
                      <dd className={`text-sm font-light ${carTypeLabel ? 'text-foreground' : 'text-foreground/30'}`}>
                        {carTypeLabel || wizard.notSelected}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1">{wizard.package}</dt>
                      <dd className={`text-sm font-light ${selectedService ? 'text-foreground' : 'text-foreground/30'}`}>
                        {selectedService ? getLocalizedServiceName(selectedService) : wizard.notSelected}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 border-t border-primary/20 pt-5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5">{wizard.estimate}</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={selectedPrice ? String(selectedPrice) : 'empty'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className={`font-serif text-3xl ${selectedPrice ? 'text-primary' : 'text-foreground/25'}`}
                      >
                        {selectedPrice ? `CHF ${selectedPrice}` : 'CHF -'}
                      </motion.p>
                    </AnimatePresence>
                    <p className="mt-2 text-[10px] leading-relaxed text-foreground/35">{wizard.estimateNote}</p>
                  </div>
                </aside>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
