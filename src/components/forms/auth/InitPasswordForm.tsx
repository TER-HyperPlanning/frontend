import { useForm } from '@tanstack/react-form';
import Button from '../../Button';
import TextField from '../../TextField';
import { LockClosedIcon } from '@heroicons/react/24/outline';

function InitPasswordForm() {
  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      // Gérer la soumission du formulaire
      console.log('Nouveau mot de passe:', value);
      // Ajoutez votre logique de réinitialisation ici
    },
  });

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2 text-center">Nouveau mot de passe</h2>
      <p className="text-sm text-center mb-6 opacity-80">
        Choisissez un nouveau mot de passe sécurisé
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
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value || value.length < 8) {
                return 'Le mot de passe doit contenir au moins 8 caractères';
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              name={field.name}
              label="Nouveau mot de passe"
              type="password"
              placeholder="Entrez votre nouveau mot de passe"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              error={field.state.meta.errors.join(', ')}
            />
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ['password'],
            onChange: ({ value, fieldApi }) => {
              const password = fieldApi.form.getFieldValue('password');
              if (value !== password) {
                return 'Les mots de passe ne correspondent pas';
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              name={field.name}
              label="Confirmer le mot de passe"
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              error={field.state.meta.errors.join(', ')}
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
              {isSubmitting ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}

export default InitPasswordForm;
