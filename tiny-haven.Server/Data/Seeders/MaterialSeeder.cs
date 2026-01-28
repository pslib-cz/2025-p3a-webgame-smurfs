using Microsoft.EntityFrameworkCore;
using tiny_haven.Server.Models;

namespace tiny_haven.Server.Data.Seeders
{
    public static class MaterialSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            var categories = new[]
            {
                new MaterialsCategories { MaterialsCategoriesId = 1, Name = "Water" },
                new MaterialsCategories { MaterialsCategoriesId = 2, Name = "Dirt" },
            };

            foreach (var category in categories)
            {
                if (!await context.MaterialsCategories.AnyAsync(c => c.MaterialsCategoriesId == category.MaterialsCategoriesId))
                {
                    context.MaterialsCategories.Add(category);
                }
            }

            await context.SaveChangesAsync();


            var waterMaterialIds = new[]
            {
                10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                20, 21, 22, 23, 24, 25, 26, 27, 28, 43, 44, 45
            };

            foreach (var id in waterMaterialIds)
            {
                if (!await context.Materials.AnyAsync(m => m.MaterialId == id))
                {
                    context.Materials.Add(new Materials
                    {
                        MaterialId = id,
                        MaterialCategoryId = 1
                    });
                }
            }

            await context.SaveChangesAsync();

            var dirtMaterialIds = new[]
            {
                6
            };

            foreach (var id in dirtMaterialIds)
            {
                if (!await context.Materials.AnyAsync(m => m.MaterialId == id))
                {
                    context.Materials.Add(new Materials
                    {
                        MaterialId = id,
                        MaterialCategoryId = 2
                    });
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
