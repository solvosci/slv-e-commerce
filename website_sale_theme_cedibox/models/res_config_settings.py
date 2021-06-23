# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (http://www.gnu.org/licenses/lgpl-3.0.html
from odoo import fields, models


class Website(models.Model):
    _inherit = 'website'

    social_fb_bool = fields.Boolean(string="Check Facebook")
    social_fb = fields.Char(string="Facebook")

    social_ig_bool = fields.Boolean(string="Check Instagram")
    social_ig = fields.Char(string="Instagram")

    social_ld_bool = fields.Boolean(string="Check Linkedin")
    social_ld = fields.Char(string="Linkedin")

    social_tlpn_bool = fields.Boolean(string="Check Telephone")
    social_tlpn = fields.Char(string="Telephone")


class WebsiteConfigSettings(models.TransientModel):

    _inherit = 'res.config.settings'

    social_fb_bool = fields.Boolean(string="Check Facebook",
                                    related='website_id.social_fb_bool',
                                    readonly=False)
    social_fb = fields.Char(string="Facebook",
                            related='website_id.social_fb',
                            readonly=False)
    social_ig_bool = fields.Boolean(string="Check Instagram",
                                    related='website_id.social_ig_bool',
                                    readonly=False)
    social_ig = fields.Char(string="Instagram",
                            related='website_id.social_ig',
                            readonly=False)

    social_ld_bool = fields.Boolean(string="Check Linkedin",
                                    related='website_id.social_ld_bool',
                                    readonly=False)
    social_ld = fields.Char(string="Linkedin",
                            related='website_id.social_ld',
                            readonly=False)
    social_tlpn_bool = fields.Boolean(string="Check Telephone",
                                      related='website_id.social_tlpn_bool',
                                      readonly=False)
    social_tlpn = fields.Char(string="Telephone",
                              related='website_id.social_tlpn',
                              readonly=False)
