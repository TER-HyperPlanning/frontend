import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../Button';
import TextField from '../../TextField';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from '@tanstack/react-router';

// Schéma de validation Zod
const loginSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

function LoginForm() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // Gérer la soumission du formulaire
      console.log('Formulaire soumis:', value);
      // Ajoutez votre logique de connexion ici
      navigate({ to: '/planning' });
    },
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">connectez vous !</h2>
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
            onChange: loginSchema.shape.email,
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
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: loginSchema.shape.password,
          }}
        >
          {(field) => (
            <TextField
              name={field.name}
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              error={field.state.meta.errors.map((error) => error ? error.message : '').join(', ')}
            />
          )}
        </form.Field>

        <div className="text-right">
          <Link 
            to="/auth/forget-pwd" 
            className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full"
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}

export default LoginForm;