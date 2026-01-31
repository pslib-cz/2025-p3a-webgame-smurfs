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
                new MaterialsCategories { MaterialsCategoriesId = 2, Name = "Grass" },
                new MaterialsCategories { MaterialsCategoriesId = 3, Name = "Meadow" },
                new MaterialsCategories { MaterialsCategoriesId = 4, Name = "Darkgrass" },
                new MaterialsCategories { MaterialsCategoriesId = 5, Name = "Darkmeadow" },
                new MaterialsCategories { MaterialsCategoriesId = 6, Name = "Stone" },
                new MaterialsCategories { MaterialsCategoriesId = 7, Name = "Wall" }
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
                20, 21, 22, 23, 24, 25, 26, 27, 28, 43, 44, 45, 90
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

            var grassMaterialIds = new[]
            {
                6, 7, 8
            };

            foreach (var id in grassMaterialIds)
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

            var meadowMaterialIds = new[]
            {
                1, 2, 3, 4
            };

            foreach (var id in meadowMaterialIds)
            {
                if (!await context.Materials.AnyAsync(m => m.MaterialId == id))
                {
                    context.Materials.Add(new Materials
                    {
                        MaterialId = id,
                        MaterialCategoryId = 3
                    });
                }
            }

            var darkgrassMaterialIds = new[]
            {
                46
            };

            foreach (var id in darkgrassMaterialIds)
            {
                if (!await context.Materials.AnyAsync(m => m.MaterialId == id))
                {
                    context.Materials.Add(new Materials
                    {
                        MaterialId = id,
                        MaterialCategoryId = 4
                    });
                }
            }

            var darkmeadowMaterialIds = new[]
            {
                68, 70
            };

            foreach (var id in darkmeadowMaterialIds)
            {
                if (!await context.Materials.AnyAsync(m => m.MaterialId == id))
                {
                    context.Materials.Add(new Materials
                    {
                        MaterialId = id,
                        MaterialCategoryId = 5
                    });
                }
            }

            var stoneMaterialIds = new[]
            {
                33, 40
            };

            foreach (var id in stoneMaterialIds)
            {
                if (!await context.Materials.AnyAsync(m => m.MaterialId == id))
                {
                    context.Materials.Add(new Materials
                    {
                        MaterialId = id,
                        MaterialCategoryId = 6
                    });
                }
            }

            var wallMaterialIds = new[]
            {
                78, 75, 81, 84, 83, 77, 76, 94, 95, 96
            };

            foreach (var id in wallMaterialIds)
            {
                if (!await context.Materials.AnyAsync(m => m.MaterialId == id))
                {
                    context.Materials.Add(new Materials
                    {
                        MaterialId = id,
                        MaterialCategoryId = 7
                    });
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
