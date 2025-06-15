import React, { useState, useEffect } from 'react';
import { Plus, Send, Edit, Trash2, Users, Mail, MessageSquare, BarChart3, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

interface Campaign {
  ID: number;
  name: string;
  description: string;
  type: string;
  status: string;
  subject: string;
  content: string;
  target_audience: string;
  scheduled_at: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  ID: number;
  user_id: string;
  phone_number: string;
  full_name: string;
  email_notifications: boolean;
  whatsapp_notifications: boolean;
  marketing_notifications: boolean;
  auth_method: string;
}

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState('campaigns');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'email',
    subject: '',
    content: '',
    target_audience: '{}',
    scheduled_at: ''
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
    loadUserProfiles();
  }, []);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await window.ezsite.apis.tablePage(10413, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: 'ID',
        IsAsc: false
      });

      if (!error && data?.List) {
        setCampaigns(data.List);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfiles = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(10411, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'ID',
        IsAsc: false
      });

      if (!error && data?.List) {
        setUserProfiles(data.List);
      }
    } catch (error) {
      console.error('Error loading user profiles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const campaignData = {
        ...formData,
        created_by: user.ID,
        status: 'draft',
        sent_count: 0,
        delivered_count: 0,
        opened_count: 0,
        clicked_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingCampaign) {
        const { error } = await window.ezsite.apis.tableUpdate(10413, {
          ID: editingCampaign.ID,
          ...campaignData
        });
        if (error) throw new Error(error);
      } else {
        const { error } = await window.ezsite.apis.tableCreate(10413, campaignData);
        if (error) throw new Error(error);
      }

      toast({
        title: 'Success',
        description: `Campaign ${editingCampaign ? 'updated' : 'created'} successfully`
      });

      setDialogOpen(false);
      resetForm();
      loadCampaigns();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save campaign',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'email',
      subject: '',
      content: '',
      target_audience: '{}',
      scheduled_at: ''
    });
    setEditingCampaign(null);
  };

  const editCampaign = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      subject: campaign.subject,
      content: campaign.content,
      target_audience: campaign.target_audience,
      scheduled_at: campaign.scheduled_at
    });
    setEditingCampaign(campaign);
    setDialogOpen(true);
  };

  const deleteCampaign = async (campaignId: number) => {
    try {
      const { error } = await window.ezsite.apis.tableDelete(10413, { ID: campaignId });
      if (error) throw new Error(error);

      toast({
        title: 'Success',
        description: 'Campaign deleted successfully'
      });
      loadCampaigns();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete campaign',
        variant: 'destructive'
      });
    }
  };

  const sendCampaign = async (campaign: Campaign) => {
    setIsLoading(true);
    try {
      // Filter target audience based on campaign type and preferences
      let targetUsers = userProfiles;

      if (campaign.type === 'email') {
        targetUsers = userProfiles.filter((profile) => profile.email_notifications);
      } else if (campaign.type === 'whatsapp') {
        targetUsers = userProfiles.filter((profile) =>
        profile.whatsapp_notifications && profile.phone_number
        );
      }

      // Only send to users who want marketing notifications
      targetUsers = targetUsers.filter((profile) => profile.marketing_notifications);

      let sentCount = 0;
      let deliveredCount = 0;

      // Send notifications to each target user
      for (const profile of targetUsers) {
        try {
          // Create notification record
          await window.ezsite.apis.tableCreate(10412, {
            user_id: profile.user_id,
            title: campaign.subject,
            message: campaign.content,
            type: 'campaign',
            channel: campaign.type === 'email' ? 'email' : 'whatsapp',
            status: 'sent',
            campaign_id: campaign.ID.toString(),
            created_at: new Date().toISOString(),
            sent_at: new Date().toISOString()
          });

          sentCount++;

          // For email campaigns, send actual emails
          if (campaign.type === 'email') {
            try {
              await window.ezsite.apis.sendEmail({
                from: 'support@ezsite.ai',
                to: [`${profile.user_id}@example.com`], // In real app, get actual email
                subject: campaign.subject,
                html: campaign.content
              });
              deliveredCount++;
            } catch (emailError) {
              console.error('Error sending email:', emailError);
            }
          }

          // For WhatsApp campaigns, create WhatsApp integration record
          if (campaign.type === 'whatsapp' && profile.phone_number) {
            try {
              await window.ezsite.apis.tableCreate(10414, {
                phone_number: profile.phone_number,
                message_content: campaign.content,
                message_type: 'text',
                status: 'sent',
                user_id: profile.user_id,
                campaign_id: campaign.ID.toString(),
                sent_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              });
              deliveredCount++;
            } catch (whatsappError) {
              console.error('Error creating WhatsApp record:', whatsappError);
            }
          }
        } catch (error) {
          console.error('Error sending to user:', profile.user_id, error);
        }
      }

      // Update campaign statistics
      await window.ezsite.apis.tableUpdate(10413, {
        ID: campaign.ID,
        status: 'completed',
        sent_count: sentCount,
        delivered_count: deliveredCount
      });

      toast({
        title: 'Success',
        description: `Campaign sent to ${sentCount} users, ${deliveredCount} delivered successfully`
      });

      loadCampaigns();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send campaign',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      scheduled: 'outline',
      active: 'default',
      completed: 'default',
      paused: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'} data-id="o2tps6q6v" data-path="src/components/CampaignManager.tsx">{status}</Badge>;
  };

  const getEngagementRate = (campaign: Campaign) => {
    if (campaign.sent_count === 0) return 0;
    return Math.round(campaign.opened_count / campaign.sent_count * 100);
  };

  const getTotalUsers = () => userProfiles.length;
  const getEmailUsers = () => userProfiles.filter((p) => p.email_notifications && p.marketing_notifications).length;
  const getWhatsAppUsers = () => userProfiles.filter((p) => p.whatsapp_notifications && p.marketing_notifications && p.phone_number).length;

  return (
    <div className="space-y-6" data-id="gzwvdhb63" data-path="src/components/CampaignManager.tsx">
      <div className="flex justify-between items-center" data-id="2n2oiv1bl" data-path="src/components/CampaignManager.tsx">
        <div data-id="joora9xli" data-path="src/components/CampaignManager.tsx">
          <h2 className="text-2xl font-bold" data-id="oayazhf9i" data-path="src/components/CampaignManager.tsx">Campaign Manager</h2>
          <p className="text-gray-600" data-id="86279dgs0" data-path="src/components/CampaignManager.tsx">Create and manage marketing campaigns</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} data-id="hscrt1dc1" data-path="src/components/CampaignManager.tsx">
          <DialogTrigger asChild data-id="qz12s12rf" data-path="src/components/CampaignManager.tsx">
            <Button onClick={resetForm} data-id="v6mv7k42m" data-path="src/components/CampaignManager.tsx">
              <Plus className="h-4 w-4 mr-2" data-id="g3lx1kf2f" data-path="src/components/CampaignManager.tsx" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" data-id="mlkyujeq0" data-path="src/components/CampaignManager.tsx">
            <DialogHeader data-id="6wlqdaa9k" data-path="src/components/CampaignManager.tsx">
              <DialogTitle data-id="5vmw3javw" data-path="src/components/CampaignManager.tsx">
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </DialogTitle>
              <DialogDescription data-id="fpjrklsjk" data-path="src/components/CampaignManager.tsx">
                Create engaging campaigns to reach your customers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-id="8bgqfmq07" data-path="src/components/CampaignManager.tsx">
              <div className="grid grid-cols-2 gap-4" data-id="w91k2h5jj" data-path="src/components/CampaignManager.tsx">
                <div className="space-y-2" data-id="hdvds84n8" data-path="src/components/CampaignManager.tsx">
                  <Label htmlFor="name" data-id="nvcns5end" data-path="src/components/CampaignManager.tsx">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Summer Sale 2024"
                    required data-id="eotyr6e7u" data-path="src/components/CampaignManager.tsx" />

                </div>
                <div className="space-y-2" data-id="n34xdj918" data-path="src/components/CampaignManager.tsx">
                  <Label htmlFor="type" data-id="weeyeyl7f" data-path="src/components/CampaignManager.tsx">Campaign Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })} data-id="htay25o5m" data-path="src/components/CampaignManager.tsx">

                    <SelectTrigger data-id="8o0pf0ml5" data-path="src/components/CampaignManager.tsx">
                      <SelectValue data-id="r8t86kqki" data-path="src/components/CampaignManager.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="0apuv5utz" data-path="src/components/CampaignManager.tsx">
                      <SelectItem value="email" data-id="jw20qoj4f" data-path="src/components/CampaignManager.tsx">Email</SelectItem>
                      <SelectItem value="whatsapp" data-id="77ufyy7lp" data-path="src/components/CampaignManager.tsx">WhatsApp</SelectItem>
                      <SelectItem value="mixed" data-id="a40sanuq6" data-path="src/components/CampaignManager.tsx">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2" data-id="ahkm5nqld" data-path="src/components/CampaignManager.tsx">
                <Label htmlFor="description" data-id="4z134nym6" data-path="src/components/CampaignManager.tsx">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Campaign description and goals" data-id="kbi31whwd" data-path="src/components/CampaignManager.tsx" />

              </div>
              
              <div className="space-y-2" data-id="chi68ks2d" data-path="src/components/CampaignManager.tsx">
                <Label htmlFor="subject" data-id="oomrf3w78" data-path="src/components/CampaignManager.tsx">Subject/Title</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="🎉 Summer Sale - Up to 50% Off!"
                  required data-id="57nwof16t" data-path="src/components/CampaignManager.tsx" />

              </div>
              
              <div className="space-y-2" data-id="motmv4zh8" data-path="src/components/CampaignManager.tsx">
                <Label htmlFor="content" data-id="cif8f6kiz" data-path="src/components/CampaignManager.tsx">Message Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Your campaign message..."
                  rows={6}
                  required data-id="0b5pi9ixd" data-path="src/components/CampaignManager.tsx" />

              </div>
              
              <div className="space-y-2" data-id="2wlicr9un" data-path="src/components/CampaignManager.tsx">
                <Label htmlFor="scheduled_at" data-id="jr5mu6xah" data-path="src/components/CampaignManager.tsx">Schedule (Optional)</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })} data-id="m9h1qpb1g" data-path="src/components/CampaignManager.tsx" />

              </div>
              
              <DialogFooter data-id="grmqtouf7" data-path="src/components/CampaignManager.tsx">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} data-id="ktlm0d3j4" data-path="src/components/CampaignManager.tsx">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} data-id="0wpdduj65" data-path="src/components/CampaignManager.tsx">
                  {isLoading ? 'Saving...' : editingCampaign ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} data-id="h1angepbk" data-path="src/components/CampaignManager.tsx">
        <TabsList data-id="gxeme3x62" data-path="src/components/CampaignManager.tsx">
          <TabsTrigger value="campaigns" data-id="9hbtdpkum" data-path="src/components/CampaignManager.tsx">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics" data-id="07wym6nke" data-path="src/components/CampaignManager.tsx">Analytics</TabsTrigger>
          <TabsTrigger value="audience" data-id="9rc8633uc" data-path="src/components/CampaignManager.tsx">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4" data-id="3xwgagz7x" data-path="src/components/CampaignManager.tsx">
          {isLoading ?
          <div className="text-center py-8" data-id="f9d82g1uy" data-path="src/components/CampaignManager.tsx">Loading campaigns...</div> :
          campaigns.length === 0 ?
          <Card data-id="wyq3sgywc" data-path="src/components/CampaignManager.tsx">
              <CardContent className="py-8 text-center" data-id="59k37kelx" data-path="src/components/CampaignManager.tsx">
                <h3 className="text-lg font-semibold mb-2" data-id="csvjlancy" data-path="src/components/CampaignManager.tsx">No campaigns yet</h3>
                <p className="text-gray-600 mb-4" data-id="2seig4bno" data-path="src/components/CampaignManager.tsx">Create your first campaign to engage with customers</p>
                <Button onClick={() => setDialogOpen(true)} data-id="tcrtfm425" data-path="src/components/CampaignManager.tsx">
                  <Plus className="h-4 w-4 mr-2" data-id="b9cpfirer" data-path="src/components/CampaignManager.tsx" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card> :

          <div className="grid gap-4" data-id="h3tnd0cna" data-path="src/components/CampaignManager.tsx">
              {campaigns.map((campaign) =>
            <Card key={campaign.ID} data-id="5qyfbc36d" data-path="src/components/CampaignManager.tsx">
                  <CardHeader data-id="oimydj1da" data-path="src/components/CampaignManager.tsx">
                    <div className="flex justify-between items-start" data-id="wbw1d9q4s" data-path="src/components/CampaignManager.tsx">
                      <div data-id="0r0iqzatx" data-path="src/components/CampaignManager.tsx">
                        <CardTitle className="flex items-center gap-2" data-id="q3jjfc34y" data-path="src/components/CampaignManager.tsx">
                          {campaign.type === 'email' ? <Mail className="h-5 w-5" data-id="jzttflg0z" data-path="src/components/CampaignManager.tsx" /> : <MessageSquare className="h-5 w-5" data-id="c2yvolefn" data-path="src/components/CampaignManager.tsx" />}
                          {campaign.name}
                        </CardTitle>
                        <CardDescription data-id="upz6n16ls" data-path="src/components/CampaignManager.tsx">{campaign.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2" data-id="zaq9r3ps9" data-path="src/components/CampaignManager.tsx">
                        {getStatusBadge(campaign.status)}
                        <div className="flex gap-1" data-id="ne5ob7iqr" data-path="src/components/CampaignManager.tsx">
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editCampaign(campaign)} data-id="qem7bnhvb" data-path="src/components/CampaignManager.tsx">

                            <Edit className="h-4 w-4" data-id="jrihjwk7u" data-path="src/components/CampaignManager.tsx" />
                          </Button>
                          {campaign.status === 'draft' &&
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendCampaign(campaign)}
                        disabled={isLoading} data-id="xsatnn3z6" data-path="src/components/CampaignManager.tsx">

                              <Send className="h-4 w-4" data-id="1shvkbdyf" data-path="src/components/CampaignManager.tsx" />
                            </Button>
                      }
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCampaign(campaign.ID)} data-id="7ddjnxj57" data-path="src/components/CampaignManager.tsx">

                            <Trash2 className="h-4 w-4" data-id="bug61d235" data-path="src/components/CampaignManager.tsx" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent data-id="mekqlebtx" data-path="src/components/CampaignManager.tsx">
                    <div className="grid grid-cols-4 gap-4 text-sm" data-id="fadr1fyno" data-path="src/components/CampaignManager.tsx">
                      <div data-id="fxzcphatk" data-path="src/components/CampaignManager.tsx">
                        <p className="font-medium" data-id="7o0lhtopi" data-path="src/components/CampaignManager.tsx">Sent</p>
                        <p className="text-2xl font-bold" data-id="il460nxzd" data-path="src/components/CampaignManager.tsx">{campaign.sent_count}</p>
                      </div>
                      <div data-id="mgv4rxugw" data-path="src/components/CampaignManager.tsx">
                        <p className="font-medium" data-id="xzkkpn7jr" data-path="src/components/CampaignManager.tsx">Delivered</p>
                        <p className="text-2xl font-bold" data-id="le6nskq5i" data-path="src/components/CampaignManager.tsx">{campaign.delivered_count}</p>
                      </div>
                      <div data-id="mf9nedsf2" data-path="src/components/CampaignManager.tsx">
                        <p className="font-medium" data-id="tatru6v9e" data-path="src/components/CampaignManager.tsx">Opened</p>
                        <p className="text-2xl font-bold" data-id="ept3o098r" data-path="src/components/CampaignManager.tsx">{campaign.opened_count}</p>
                      </div>
                      <div data-id="o566iadqd" data-path="src/components/CampaignManager.tsx">
                        <p className="font-medium" data-id="8r1ban2qx" data-path="src/components/CampaignManager.tsx">Engagement</p>
                        <p className="text-2xl font-bold" data-id="o7bfvhyg7" data-path="src/components/CampaignManager.tsx">{getEngagementRate(campaign)}%</p>
                      </div>
                    </div>
                    {campaign.sent_count > 0 &&
                <div className="mt-4" data-id="67w8tmwpg" data-path="src/components/CampaignManager.tsx">
                        <div className="flex justify-between text-sm mb-1" data-id="h988nw5cq" data-path="src/components/CampaignManager.tsx">
                          <span data-id="zy0n8gcst" data-path="src/components/CampaignManager.tsx">Delivery Rate</span>
                          <span data-id="4ogidaha6" data-path="src/components/CampaignManager.tsx">{Math.round(campaign.delivered_count / campaign.sent_count * 100)}%</span>
                        </div>
                        <Progress
                    value={campaign.delivered_count / campaign.sent_count * 100}
                    className="h-2" data-id="kd2x85nwq" data-path="src/components/CampaignManager.tsx" />

                      </div>
                }
                  </CardContent>
                </Card>
            )}
            </div>
          }
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4" data-id="vxblntano" data-path="src/components/CampaignManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="0mbyc4k9g" data-path="src/components/CampaignManager.tsx">
            <Card data-id="aqq1tgtkp" data-path="src/components/CampaignManager.tsx">
              <CardHeader className="pb-2" data-id="gz39oq6ki" data-path="src/components/CampaignManager.tsx">
                <CardTitle className="text-sm font-medium" data-id="6aqy2adr0" data-path="src/components/CampaignManager.tsx">Total Campaigns</CardTitle>
              </CardHeader>
              <CardContent data-id="ogspvr35o" data-path="src/components/CampaignManager.tsx">
                <div className="text-2xl font-bold" data-id="055lhyrvk" data-path="src/components/CampaignManager.tsx">{campaigns.length}</div>
                <p className="text-xs text-gray-600" data-id="u1v38wrmd" data-path="src/components/CampaignManager.tsx">All time</p>
              </CardContent>
            </Card>
            <Card data-id="rzuuff0w0" data-path="src/components/CampaignManager.tsx">
              <CardHeader className="pb-2" data-id="0xk1nzyea" data-path="src/components/CampaignManager.tsx">
                <CardTitle className="text-sm font-medium" data-id="1tm99ya0x" data-path="src/components/CampaignManager.tsx">Total Sent</CardTitle>
              </CardHeader>
              <CardContent data-id="m5sk2q0ks" data-path="src/components/CampaignManager.tsx">
                <div className="text-2xl font-bold" data-id="22rotepnf" data-path="src/components/CampaignManager.tsx">
                  {campaigns.reduce((sum, c) => sum + c.sent_count, 0)}
                </div>
                <p className="text-xs text-gray-600" data-id="wilil4hzi" data-path="src/components/CampaignManager.tsx">Messages sent</p>
              </CardContent>
            </Card>
            <Card data-id="r7m05npxj" data-path="src/components/CampaignManager.tsx">
              <CardHeader className="pb-2" data-id="as5iggpca" data-path="src/components/CampaignManager.tsx">
                <CardTitle className="text-sm font-medium" data-id="yek6qfr51" data-path="src/components/CampaignManager.tsx">Avg. Engagement</CardTitle>
              </CardHeader>
              <CardContent data-id="2ft5vxaij" data-path="src/components/CampaignManager.tsx">
                <div className="text-2xl font-bold" data-id="5ztn8jko8" data-path="src/components/CampaignManager.tsx">
                  {campaigns.length > 0 ?
                  Math.round(campaigns.reduce((sum, c) => sum + getEngagementRate(c), 0) / campaigns.length) :
                  0}%
                </div>
                <p className="text-xs text-gray-600" data-id="y2i5z2l88" data-path="src/components/CampaignManager.tsx">Open rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4" data-id="m3g76phxz" data-path="src/components/CampaignManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="h5wtfomk1" data-path="src/components/CampaignManager.tsx">
            <Card data-id="qtuwajapc" data-path="src/components/CampaignManager.tsx">
              <CardHeader className="pb-2" data-id="ck3ys9tgu" data-path="src/components/CampaignManager.tsx">
                <CardTitle className="text-sm font-medium flex items-center gap-2" data-id="e2jsxw3qm" data-path="src/components/CampaignManager.tsx">
                  <Users className="h-4 w-4" data-id="9ecgvbp64" data-path="src/components/CampaignManager.tsx" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent data-id="6jrr1f3yh" data-path="src/components/CampaignManager.tsx">
                <div className="text-2xl font-bold" data-id="jdiy68s4n" data-path="src/components/CampaignManager.tsx">{getTotalUsers()}</div>
                <p className="text-xs text-gray-600" data-id="s411scc90" data-path="src/components/CampaignManager.tsx">Registered users</p>
              </CardContent>
            </Card>
            <Card data-id="xc5wuar0u" data-path="src/components/CampaignManager.tsx">
              <CardHeader className="pb-2" data-id="7clvlwskc" data-path="src/components/CampaignManager.tsx">
                <CardTitle className="text-sm font-medium flex items-center gap-2" data-id="xbz4vobvf" data-path="src/components/CampaignManager.tsx">
                  <Mail className="h-4 w-4" data-id="9zvkd66wx" data-path="src/components/CampaignManager.tsx" />
                  Email Reachable
                </CardTitle>
              </CardHeader>
              <CardContent data-id="j2yuzvwr9" data-path="src/components/CampaignManager.tsx">
                <div className="text-2xl font-bold" data-id="xthr2ytw0" data-path="src/components/CampaignManager.tsx">{getEmailUsers()}</div>
                <p className="text-xs text-gray-600" data-id="12jotzfza" data-path="src/components/CampaignManager.tsx">Accept email marketing</p>
              </CardContent>
            </Card>
            <Card data-id="kcuzx9zsb" data-path="src/components/CampaignManager.tsx">
              <CardHeader className="pb-2" data-id="a5hqtqemw" data-path="src/components/CampaignManager.tsx">
                <CardTitle className="text-sm font-medium flex items-center gap-2" data-id="li9j0j00q" data-path="src/components/CampaignManager.tsx">
                  <MessageSquare className="h-4 w-4" data-id="kmpjw3xj5" data-path="src/components/CampaignManager.tsx" />
                  WhatsApp Reachable
                </CardTitle>
              </CardHeader>
              <CardContent data-id="ik8ea6wmh" data-path="src/components/CampaignManager.tsx">
                <div className="text-2xl font-bold" data-id="bzhxsbnwv" data-path="src/components/CampaignManager.tsx">{getWhatsAppUsers()}</div>
                <p className="text-xs text-gray-600" data-id="m37mucwpj" data-path="src/components/CampaignManager.tsx">Accept WhatsApp marketing</p>
              </CardContent>
            </Card>
          </div>
          
          <Card data-id="m2kiif0v0" data-path="src/components/CampaignManager.tsx">
            <CardHeader data-id="zkserhnyg" data-path="src/components/CampaignManager.tsx">
              <CardTitle data-id="9et42nbd9" data-path="src/components/CampaignManager.tsx">User Preferences</CardTitle>
              <CardDescription data-id="q9fvkxzat" data-path="src/components/CampaignManager.tsx">
                Overview of user notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent data-id="46w85az6q" data-path="src/components/CampaignManager.tsx">
              <div className="space-y-4" data-id="hlki2rr4u" data-path="src/components/CampaignManager.tsx">
                <div data-id="ojtk2fnas" data-path="src/components/CampaignManager.tsx">
                  <div className="flex justify-between text-sm mb-1" data-id="tvyfk80ph" data-path="src/components/CampaignManager.tsx">
                    <span data-id="ycjw7r23e" data-path="src/components/CampaignManager.tsx">Email Notifications</span>
                    <span data-id="6lf7npa3e" data-path="src/components/CampaignManager.tsx">{getEmailUsers()}/{getTotalUsers()}</span>
                  </div>
                  <Progress
                    value={getTotalUsers() > 0 ? getEmailUsers() / getTotalUsers() * 100 : 0}
                    className="h-2" data-id="sedzvb9xi" data-path="src/components/CampaignManager.tsx" />

                </div>
                <div data-id="cimxno4u8" data-path="src/components/CampaignManager.tsx">
                  <div className="flex justify-between text-sm mb-1" data-id="zopte530o" data-path="src/components/CampaignManager.tsx">
                    <span data-id="pe9rtuuni" data-path="src/components/CampaignManager.tsx">WhatsApp Notifications</span>
                    <span data-id="wxq7c8d4m" data-path="src/components/CampaignManager.tsx">{getWhatsAppUsers()}/{getTotalUsers()}</span>
                  </div>
                  <Progress
                    value={getTotalUsers() > 0 ? getWhatsAppUsers() / getTotalUsers() * 100 : 0}
                    className="h-2" data-id="2pw3jv90o" data-path="src/components/CampaignManager.tsx" />

                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

}