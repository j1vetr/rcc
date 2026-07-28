import React, { useEffect } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { useSubmitQuote, useListServices } from '@workspace/api-client-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { CarTypePicker } from './CarTypePicker';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  canton: z.string().min(2, 'Canton is required'),
  serviceType: z.string().min(1, 'Service is required'),
  carType: z.string().min(1, 'Car type is required'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function QuoteForm() {
  const { t, lang } = useTranslation();
  const submitQuote = useSubmitQuote();
  const { data: services } = useListServices({ query: { queryKey: ['services'] } });

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
      const customEvent = e as CustomEvent;
      form.setValue('serviceType', customEvent.detail);
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

  const onSubmit = (data: FormValues) => {
    submitQuote.mutate({ data });
  };

  const getLocalizedServiceName = (service: any) => {
    const key = `name${lang.toUpperCase()}` as keyof typeof service;
    return service[key];
  };

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
    <section id="quote" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Left Column - Sticky Header */}
          <div className="w-full lg:w-5/12">
            <div className="lg:sticky lg:top-32 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-8 leading-[1.1] tracking-tight">
                  {t.quote.title}
                </h2>
                <div className="w-16 h-px bg-primary/50 mb-8" />
                <p className="text-foreground/60 text-lg md:text-xl font-light leading-relaxed max-w-sm">
                  {t.quote.subtitle}
                </p>
              </motion.div>

              <div className="grid gap-4 border-y border-white/10 py-6 text-sm text-foreground/55">
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

              {/* Decorative atelier mark */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="hidden lg:flex items-center gap-6 opacity-30"
              >
                <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center">
                  <div className="w-1 h-1 bg-foreground/40 rounded-full" />
                </div>
                <div className="h-px bg-foreground/20 flex-grow max-w-[120px]" />
              </motion.div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full lg:w-7/12 pt-4 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">

                  {/* Contact Info Group */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="text-primary text-xs font-serif italic tracking-widest">01</span>
                      <div className="h-px bg-white/5 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-3 relative group">
                            <FormLabel className="text-foreground/50 uppercase tracking-[0.2em] text-[10px] font-medium transition-colors group-focus-within:text-primary">
                              {t.quote.form.name}
                            </FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-name"
                                placeholder={t.quote.form.placeholders.name}
                                {...field}
                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-2 h-auto text-lg md:text-xl font-light text-foreground placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors shadow-none"
                              />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-3 relative group">
                            <FormLabel className="text-foreground/50 uppercase tracking-[0.2em] text-[10px] font-medium transition-colors group-focus-within:text-primary">
                              {t.quote.form.email}
                            </FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-email"
                                type="email"
                                placeholder={t.quote.form.placeholders.email}
                                {...field}
                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-2 h-auto text-lg md:text-xl font-light text-foreground placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors shadow-none"
                              />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-3 relative group">
                            <FormLabel className="text-foreground/50 uppercase tracking-[0.2em] text-[10px] font-medium transition-colors group-focus-within:text-primary">
                              {t.quote.form.phone}
                            </FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-phone"
                                type="tel"
                                placeholder={t.quote.form.placeholders.phone}
                                {...field}
                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-2 h-auto text-lg md:text-xl font-light text-foreground placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors shadow-none"
                              />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="canton"
                        render={({ field }) => (
                          <FormItem className="space-y-3 relative group">
                            <FormLabel className="text-foreground/50 uppercase tracking-[0.2em] text-[10px] font-medium transition-colors group-focus-within:text-primary">
                              {t.quote.form.canton}
                            </FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-canton"
                                placeholder={t.quote.form.placeholders.canton}
                                {...field}
                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-2 h-auto text-lg md:text-xl font-light text-foreground placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors shadow-none"
                              />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Service & Vehicle Group */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="text-primary text-xs font-serif italic tracking-widest">02</span>
                      <div className="h-px bg-white/5 flex-grow" />
                    </div>

                    <div className="space-y-12">
                      <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem className="space-y-3 group">
                            <FormLabel className="text-foreground/50 uppercase tracking-[0.2em] text-[10px] font-medium transition-colors group-focus-within:text-primary">
                              {t.quote.form.serviceType}
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                              <FormControl>
                                <SelectTrigger
                                  data-testid="select-service-type"
                                  className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-2 h-auto text-lg md:text-xl font-light text-foreground focus:ring-0 focus:ring-offset-0 focus:border-primary transition-colors data-[placeholder]:text-foreground/20 shadow-none"
                                >
                                  <SelectValue placeholder={t.quote.form.placeholders.serviceType} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card/95 border-white/10 text-foreground backdrop-blur-xl">
                                {services?.map(s => (
                                  <SelectItem
                                    data-testid={`option-service-${s.id}`}
                                    key={s.id}
                                    value={s.id}
                                    className="focus:bg-primary/10 focus:text-primary cursor-pointer py-3 text-base"
                                  >
                                    {getLocalizedServiceName(s)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="carType"
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <FormLabel className="text-foreground/50 uppercase tracking-[0.2em] text-[10px] font-medium block">
                              {t.quote.form.carType}
                            </FormLabel>
                            <FormControl>
                              <div className="pt-2">
                                <CarTypePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={t.quote.carTypes}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Message Group */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="text-primary text-xs font-serif italic tracking-widest">03</span>
                      <div className="h-px bg-white/5 flex-grow" />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-3 group">
                          <FormLabel className="text-foreground/50 uppercase tracking-[0.2em] text-[10px] font-medium transition-colors group-focus-within:text-primary">
                            {t.quote.form.message}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              data-testid="input-message"
                              placeholder={t.quote.form.placeholders.message}
                              {...field}
                              className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-4 min-h-[160px] resize-none text-lg md:text-xl font-light leading-relaxed text-foreground placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors shadow-none"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-8">
                    <button
                      type="submit"
                      data-testid="button-submit-quote"
                      disabled={submitQuote.isPending}
                      className="w-full lg:w-auto min-w-[280px] btn-gold-luxury h-16 uppercase tracking-[0.2em] text-sm font-medium text-background disabled:opacity-50 disabled:cursor-not-allowed px-12"
                    >
                      {submitQuote.isPending ? t.quote.form.submitting : t.quote.form.submit}
                    </button>
                  </div>

                </form>
              </Form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
