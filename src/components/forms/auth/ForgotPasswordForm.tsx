import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../Button';
import TextField from '../../TextField';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from '@tanstack/react-router';

// Schéma de validation Zod
const forgotPasswordSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
});

function ForgotPasswordForm() {
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      // Gérer la soumission du formulaire
      console.log('Demande de réinitialisation pour:', value);
      // Ajoutez votre logique de réinitialisation ici
      // Simuler un délai pour l'envoi de l'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Redirection vers la page de réinitialisation
      navigate({ to: '/auth/init-pwd' });
    },
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Mot de passe oublié ?</h2>
      <p className="text-xs sm:text-sm text-center mb-4 sm:mb-6 opacity-80">
        Entrez votre adresse email pour recevoir un lien de réinitialisation
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="email"
          validators={{
            onChange: forgotPasswordSchema.shape.email,
          }}
        >
          {(field) => (
            <TextField
              name={field.name}
              label="Email"
              type="email"
              placeholder="Entrez votre email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              leftIcon={<EnvelopeIcon className="w-5 h-5" />}
              error={field.state.meta.errors.map((error) => error ? error.message : '').join(', ')}
              className="bg-white/10 text-white placeholder:text-white/60"
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien'}
            </Button>
          )}
        </form.Subscribe>

        <div className="text-center mt-4">
          <Link 
            to="/auth/login" 
            className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity"
          >
            Retour à la connexion
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
