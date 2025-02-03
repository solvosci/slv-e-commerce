# © 2025 Solvos Consultoría Informática (<http://www.solvos.es>)
# License AGPL-3 - See http://www.gnu.org/licenses/agpl-3.0.html

import base64
from io import BytesIO
from PIL import Image, ImageChops
from odoo import models, fields, api
import logging

_logger = logging.getLogger(__name__)

class ProductTemplate(models.Model):
    _inherit = "product.template"

    def trim_product_images(self):
        """Method to get all products images"""
        for record in self.filtered(lambda r: r.image_1920):
            record.image_1920 = self._trim_image(record.image_1920, record.name)

            for variant in record.product_variant_ids.filtered(lambda v: v.image_1920):
                variant.image_1920 = self._trim_image(variant.image_1920, f"{record.name}")

                for image in variant.product_variant_image_ids.filtered(lambda img: img.image_1920):
                    image.image_1920 = self._trim_image(image.image_1920, f"{record.name}")

    def _trim_image(self, image_base64, product_name):
        """Method to change size images. Delete spaces white of image to show big size"""
        try:
            image_data = base64.b64decode(image_base64)
            image = Image.open(BytesIO(image_data))

            if image.mode == 'RGBA':
                bg = Image.new("RGBA", image.size, (255, 255, 255, 255))
                bg.paste(image, (0, 0), image)
                image = bg.convert("RGB")

            image = image.convert("RGB")

            bg = Image.new(image.mode, image.size, (255, 255, 255))
            diff = ImageChops.difference(image, bg)
            bbox = diff.getbbox()

            if bbox:
                image = image.crop(bbox)
                buffered = BytesIO()
                image.save(buffered, format="JPEG", quality=100)
                _logger.info(f"Changed image for product: {product_name}")
                return base64.b64encode(buffered.getvalue())
            else:
                _logger.info(f"Not found spaces white in product image: {product_name}")
                return image_base64

        except Exception as e:
            _logger.error(f"Error to process product image: {product_name}: {str(e)}")
            return image_base64

    @api.model
    def cron_trim_product_images(self):

        products = self.search([('image_1920', '!=', False), ('website_published', '=', True)])
        for product in products:
            product.trim_product_images()

        logging.info("Trim product images finished")
