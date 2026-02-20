import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const moduleSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  code: z.string().min(2, "Le code est obligatoire"),
  formationId: z.string().min(1, "Formation obligatoire"),
});

type Module = {
  id: number;
  name: string;
  code: string;
  formationId: string;
};

type Props = {
  onSubmit: (data: {
    name: string;
    code: string;
    formationId: string;
  }) => void;
  editingModule: Module | null;
  selectedFormation: string;
};

export default function ModuleForm({
  onSubmit,
  editingModule,
  selectedFormation,
}: Props) {
  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      formationId: selectedFormation,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
      form.reset();
    },
  });

  useEffect(() => {
    form.setFieldValue("formationId", selectedFormation);
  }, [selectedFormation]);

  useEffect(() => {
    if (editingModule) {
      form.setFieldValue("name", editingModule.name);
      form.setFieldValue("code", editingModule.code);
      form.setFieldValue("formationId", editingModule.formationId);
    }
  }, [editingModule]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="bg-base-100 p-6 rounded-xl shadow space-y-4"
    >
      <form.Field
        name="name"
        validators={{ onChange: moduleSchema.shape.name }}
      >
        {(field) => (
          <div>
            <label className="block mb-1 font-medium">
              Nom du module
            </label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="input input-bordered w-full"
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-error text-sm mt-1">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="code"
        validators={{ onChange: moduleSchema.shape.code }}
      >
        {(field) => (
          <div>
            <label className="block mb-1 font-medium">
              Code du module
            </label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="input input-bordered w-full"
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-error text-sm mt-1">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        className="btn btn-primary w-full"
      >
        {editingModule ? "Mettre à jour" : "Ajouter le module"}
      </button>
    </form>
  );
}