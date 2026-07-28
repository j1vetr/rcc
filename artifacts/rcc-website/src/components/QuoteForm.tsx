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
import { CheckCircle2 } from 'lucide-react';
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
      <section id="quote" className="py-20 bg-background relative section-border">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-primary/30 p-12 flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CheckCircle2 className="w-16 h-16 text-primary mb-6 relative z-10" strokeWidth={1} />
            <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-4 relative z-10">
              {t.quote.form.successTitle}
            </h2>
            <div className="w-16 h-px gold-divider mb-4" />
            <p className="text-foreground/60 text-base font-light leading-relaxed relative z-10">
              {t.quote.form.successDesc}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-20 bg-background relative section-border">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-4">
            {t.quote.title}
          </h2>
          <div className="w-20 h-px gold-divider mx-auto mb-5" />
          <p className="text-foreground/60 text-base md:text-lg max-w-xl mx-auto font-light">
            {t.quote.subtitle}
          </p>
        </motion.div>

        <motion.div 
          className="bg-card p-8 md:p-12 border border-border shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/70 uppercase tracking-[0.15em] text-xs font-light">
                        {t.quote.form.name}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          data-testid="input-name" 
                          placeholder={t.quote.form.placeholders.name} 
                          {...field} 
                          className="bg-background border-border text-foreground h-12 font-light focus-visible:ring-primary focus-visible:border-primary transition-all" 
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
                    <FormItem>
                      <FormLabel className="text-foreground/70 uppercase tracking-[0.15em] text-xs font-light">
                        {t.quote.form.email}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          data-testid="input-email" 
                          type="email" 
                          placeholder={t.quote.form.placeholders.email} 
                          {...field} 
                          className="bg-background border-border text-foreground h-12 font-light focus-visible:ring-primary focus-visible:border-primary transition-all" 
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/70 uppercase tracking-[0.15em] text-xs font-light">
                        {t.quote.form.phone}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          data-testid="input-phone" 
                          type="tel" 
                          placeholder={t.quote.form.placeholders.phone} 
                          {...field} 
                          className="bg-background border-border text-foreground h-12 font-light focus-visible:ring-primary focus-visible:border-primary transition-all" 
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
                    <FormItem>
                      <FormLabel className="text-foreground/70 uppercase tracking-[0.15em] text-xs font-light">
                        {t.quote.form.canton}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          data-testid="input-canton" 
                          placeholder={t.quote.form.placeholders.canton} 
                          {...field} 
                          className="bg-background border-border text-foreground h-12 font-light focus-visible:ring-primary focus-visible:border-primary transition-all" 
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/70 uppercase tracking-[0.15em] text-xs font-light">
                      {t.quote.form.serviceType}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger 
                          data-testid="select-service-type" 
                          className="bg-background border-border text-foreground h-12 font-light focus:ring-primary"
                        >
                          <SelectValue placeholder={t.quote.form.placeholders.serviceType} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border text-foreground">
                        {services?.map(s => (
                          <SelectItem 
                            data-testid={`option-service-${s.id}`} 
                            key={s.id} 
                            value={s.id} 
                            className="focus:bg-primary/10 focus:text-primary cursor-pointer"
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
                  <FormItem>
                    <FormLabel className="text-foreground/70 uppercase tracking-[0.15em] text-xs font-light mb-4 block">
                      {t.quote.form.carType}
                    </FormLabel>
                    <FormControl>
                      <CarTypePicker 
                        value={field.value} 
                        onChange={field.onChange} 
                        options={t.quote.carTypes} 
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/70 uppercase tracking-[0.15em] text-xs font-light">
                      {t.quote.form.message}
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        data-testid="input-message"
                        placeholder={t.quote.form.placeholders.message} 
                        {...field} 
                        className="bg-background border-border text-foreground min-h-[120px] resize-none font-light leading-relaxed focus-visible:ring-primary focus-visible:border-primary transition-all" 
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                data-testid="button-submit-quote"
                disabled={submitQuote.isPending}
                className="w-full btn-gold-luxury h-14 uppercase tracking-[0.25em] text-sm font-medium text-background disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitQuote.isPending ? t.quote.form.submitting : t.quote.form.submit}
              </button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}
