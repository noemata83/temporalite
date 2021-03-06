from django.conf.urls import url
# from rest_framework.urlpatterns import format_suffix_patterns
from accounts import views

urlpatterns = [
    url(r'^register$', views.RegistrationAPI.as_view()),
    url(r'^login$', views.LoginAPI.as_view()),
    url(r'^user$', views.UserAPI.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^users/(?P<username>[a-zA-Z0-9_]+)/$', views.CheckUsername.as_view())
]
